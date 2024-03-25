import React, { useState, useEffect } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";

export default function Tanya() {
  const [prompt, updatePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (prompt.trim() === "") {
      setMessages([]);
    }
  }, [prompt]);

  const sendMessage = async (message) => {
    setMessages((prevMessages) => [...prevMessages, { message, isUser: true }]);
    updatePrompt(message);

    try {
      setLoading(true);
      const res = await fetch('/api/chat/chat', { // Updated URL to match the endpoint
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: message }),
      });
      if (!res.ok || !res.body) {
        throw new Error(res.statusText);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let loopRunner = true;

      let answer = "";
      while (loopRunner) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        answer += decodedChunk;
      }
      setMessages((prevMessages) => [...prevMessages, { message: answer, isUser: false }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1 className='text-4x1 text-center pt-5'>Tanya Apapun Pertanyaanmu tentang Account Receivable Management</h1>
      <strong className="text-center pt-5"> ChatBot Account Receivable Management</strong>
      <div className="mx-auto my-10 bg-dark shadow-xl rounded-xl w-full max-w-5xl">
        <div className="chat-messages h-96">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg.message} isUser={msg.isUser} />
          ))}
        </div>
        <ChatInput onSubmit={sendMessage} />
      </div>
    </div>
  );
}