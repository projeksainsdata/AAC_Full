// models/Thread.js
import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  threadId: { type: String, required: true, unique: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
