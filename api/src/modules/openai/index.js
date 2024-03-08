import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemMessage = {
  role: "system",
  content:
    "Tanya di tentang HIV/AIDS",
};

export const getStreamingCompletion = async ({ userPrompt }) => {
  return client.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [systemMessage, { role: "user", content: userPrompt }],
    stream: true,
    temperature: 0.7
  });
};

