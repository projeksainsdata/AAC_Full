import { openai } from "./Assistant.js";
import { createAssistantIfNeeded } from "./Assistant.js";


const assistant = await createAssistantIfNeeded();
// Assistant can be created via API or UI
const assistantId = assistant.id;
let pollingInterval;

// Set up a Thread
async function createThread() {
  console.log("Creating a new thread...");
  const thread = await openai.beta.threads.create();
  console.log(thread);
  return thread;
}

async function addMessage(threadId, message) {
  console.log("Adding a new message to thread: " + threadId);
  const response = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
  return response;
}

async function runAssistant(threadId) {
  console.log("Running assistant for thread: " + threadId);
  const response = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  console.log(response);

  return response;
}

async function checkingStatus(res, threadId, runId) {
  const runObject = await openai.beta.threads.runs.retrieve(threadId, runId);

  const status = runObject.status;
  console.log(runObject);
  console.log("Current status: " + status);

  if (status == "completed") {
    clearInterval(pollingInterval);

    const messagesList = await openai.beta.threads.messages.list(threadId);
    let messages = [];

    messagesList.body.data.forEach((message) => {
      messages.push(message.content);
    });

    res.json({ messages });
  }
}

app.get("/thread", (req, res) => {
    createThread().then((thread) => {
      res.json({ threadId: thread.id });
    });
  });
  
app.post("/message", (req, res) => {
    const { message, threadId } = req.body;
    addMessage(threadId, message).then((message) => {
      // res.json({ messageId: message.id });
  
      // Run the assistant
      runAssistant(threadId).then((run) => {
        const runId = run.id;
  
        // Check the status
        pollingInterval = setInterval(() => {
          checkingStatus(res, threadId, runId);
        }, 5000);
      });
    });
  });