import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to upload a file
async function uploadFile(filePath) {
  try {
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    });
    return file.id; // Return the uploaded file's ID
  } catch (error) {
    console.error("Error uploading file:", filePath, error);
    throw error; // Rethrow to handle it in the caller
  }
}

export async function createAssistantIfNeeded() {
  try {
    // Check if the assistant already exists
    const existingAssistants = await openai.beta.assistants.list();
    const existingAssistant = existingAssistants.data.find(
      (assistant) => assistant.name === "LegalGuide"
    );

    if (existingAssistant) {
      return existingAssistant; // Return the existing assistant if found
    }

    // Upload files separately
    const fileIds = await Promise.all([
      uploadFile("/home/ardikasatria/mern-blog/api/Lemon1.txt")
    ]);

    // If not found, create a new assistant with both file IDs
    const assistant = await openai.beta.assistants.create({
      name: "LegalGuide",
      instructions:
        "LegalGuide AI is your intelligent legal companion, designed to assist you in navigating the complex world of laws and regulations effortlessly.",
      model: "gpt-3.5-turbo",
      tools: [{ type: "code_interpreter" }],
      file_ids: fileIds, // Use the uploaded file IDs
    });

    console.log("New assistant created:", assistant);
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
  }
}

createAssistantIfNeeded();