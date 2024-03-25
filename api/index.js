// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import tanyaRoutes from './routes/tanya.route.js';
import commentRoutes from './routes/comment.route.js';

import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
import OpenAI from 'openai';

const { OPENAI_API_KEY, ASSISTANT_ID } = process.env;

// Setup Express

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Set up OpenAI Client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Assistant can be created via API or UI
const assistantId = ASSISTANT_ID;
let pollingInterval;

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
        assistant_id: assistantId
        // Make sure to not overwrite the original instruction, unless you want to
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

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/chat', tanyaRoutes);
 // Use the new route
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


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});
