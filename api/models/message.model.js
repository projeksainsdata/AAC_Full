// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  role: { type: String, required: true },
  content: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
