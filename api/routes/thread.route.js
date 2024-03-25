// routes/threadRoutes.js
import express from "express";
import { createThread, addMessage } from "../controllers/thread.controller.js";

const router = express.Router();

router.post("/thread", createThread);

router.post("/message", async (req, res) => {
  const { message, threadId } = req.body;
  
  try {
    const assistant = await createAssistantIfNeeded(); // Memastikan asisten sudah dibuat
    const assistantId = assistant.id;

    // Set up a Thread
    console.log("Creating a new thread...");
    const thread = await openai.beta.threads.create();
    console.log(thread);
    
    console.log("Adding a new message to thread: " + thread.id);
    const response = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    console.log("Running assistant for thread: " + thread.id);
    const assistantResponse = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    console.log(assistantResponse);

    res.json({ threadId: thread.id });
  } catch (error) {
    console.error("Error handling message:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

