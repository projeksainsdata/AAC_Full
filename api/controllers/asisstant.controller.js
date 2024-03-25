// controllers/assistantController.js
import { createAssistantIfNeeded } from "../assistant.js";
import { createThread, addMessage, runAssistant, checkingStatus } from "../asisstant1.js";

let assistantId;
let pollingInterval;

export const initAssistant = async () => {
  const assistant = await createAssistantIfNeeded();
  assistantId = assistant.id;
};

export const createThreadController = async (req, res) => {
  try {
    const thread = await createThread();
    res.json({ threadId: thread.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMessageController = async (req, res) => {
  const { message, threadId } = req.body;
  try {
    const response = await addMessage(threadId, message);
    const runId = response.id;

    pollingInterval = setInterval(() => {
      checkingStatus(res, threadId, runId);
    }, 5000);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const stopPolling = () => {
  clearInterval(pollingInterval);
};
