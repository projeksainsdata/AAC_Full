import React, { useState, useEffect } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";



const Chat = () => {
    const [prompt, updatePrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [threadId, setThreadId] = useState("");
    const [lastAnswer, setLastAnswer] = useState(""); // Add state for last answer
  
    useEffect(() => {
      if (prompt.trim() === "") {
        setMessages([]);
      }
    }, [prompt]);
  
    useEffect(() => {
      fetchThread();
    }, []);
  
    const fetchThread = async () => {
      try {
        const res = await fetch(`/thread`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();
        setThreadId(data.threadId);
      } catch (err) {
        console.error(err);
      }
    };
  
    const sendMessage = async (message) => {
      setMessages((prevMessages) => [...prevMessages, { message, isUser: true }]);
      updatePrompt(message);
  
      try {
        setLoading(true);
        const res = await fetch(`/message`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, threadId }),
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();
        const answerMessages = data.messages.map(messageGroup => {
          return messageGroup.map(message => {
            return message.text.value;
          }).join("");
        });
        const answer = answerMessages.join("");
        
        // Check if the answer is the same as the last message
        if (answer !== lastAnswer) {
          setMessages((prevMessages) => [...prevMessages, { message: answer, isUser: false }]);
          setLastAnswer(answer); // Update last answer
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="chat-container">
        <h1 className='text-4xl text-center pt-5'>Asisten Account Receivable Management</h1>
        <div className="mx-auto my-10 bg-dark shadow-xl rounded-xl w-full max-w-5xl">
          <div className="chat-messages h-96 overflow-auto">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg.message} isUser={msg.isUser} />
            ))}
            {loading && <div className="text-center mt-2">Loading...</div>}
          </div>
          <ChatInput onSubmit={sendMessage} />
          
        </div>
      </div>
    );
};
  
export default Chat;
