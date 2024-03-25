// Set up a Thread
async function createThread(openai) {
    console.log("Creating a new thread...");
    const thread = await openai.beta.threads.create();
    console.log(thread);
    return thread;
  }
  
  async function addMessage(openai, threadId, message) {
    console.log("Adding a new message to thread: " + threadId);
    const response = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
    return response;
  }
  
  async function runAssistant(openai, threadId, assistantId) {
    console.log("Running assistant for thread: " + threadId);
    const response = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  
    console.log(response);
  
    return response;
  }
  
  async function checkingStatus(openai, res, threadId, runId, pollingInterval) {
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
  
  export { createThread, addMessage, runAssistant, checkingStatus };
  