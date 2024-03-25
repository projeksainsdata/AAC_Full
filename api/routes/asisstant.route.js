// routes/assistantRoutes.js
import express from "express";

const router = express.Router();

// Require the OpenAI and other necessary modules
const OpenAI = require('openai');
const { OPENAI_API_KEY, ASSISTANT_ID } = process.env;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Set up a Thread
async function createThread() {
  console.log('Creating a new thread...');
  const thread = await openai.beta.threads.create();
  return thread;
}

async function addMessage(threadId, message) {
  console.log('Adding a new message to thread: ' + threadId);
  const response = await openai.beta.threads.messages.create(
    threadId,
    {
      role: "user",
      content: message
    }
  );
  return response;
}

async function runAssistant(threadId) {
  console.log('Running assistant for thread: ' + threadId)
  const response = await openai.beta.threads.runs.create(
    threadId,
    {
      assistant_id: ASSISTANT_ID
    }
  );

  console.log(response)

  return response;
}

async function checkingStatus(res, threadId, runId) {
  const runObject = await openai.beta.threads.runs.retrieve(
    threadId,
    runId
  );

  const status = runObject.status;
  console.log(runObject)
  console.log('Current status: ' + status);

  if(status == 'completed') {
    clearInterval(pollingInterval);

    const messagesList = await openai.beta.threads.messages.list(threadId);
    let messages = []

    messagesList.body.data.forEach(message => {
      messages.push(message.content);
    });

    res.json({ messages });
  }
}

// Route to create a new thread
router.get('/thread', async (req, res) => {
  try {
    const thread = await createThread();
    res.json({ threadId: thread.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a message to a thread and run the assistant
router.post('/message', async (req, res) => {
  const { message, threadId } = req.body;
  try {
    const addedMessage = await addMessage(threadId, message);
    const run = await runAssistant(threadId);
    const runId = run.id;

    // Check the status
    pollingInterval = setInterval(() => {
      checkingStatus(res, threadId, runId);
    }, 5000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
