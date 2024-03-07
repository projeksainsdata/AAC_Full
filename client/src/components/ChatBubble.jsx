import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatBubble = ({ message, isUser }) => {
    const bubbleClasses = isUser
      ? 'bg-blue-400 text-white rounded-br-none self-end'
      : 'bg-gray-200 text-black rounded-bl-none self-start';
  
    const tailClasses = isUser
      ? 'right-0 -mr-2 bg-blue-400'
      : 'left-0 -ml-2 bg-gray-200';

    // Added flex container class
    const containerClasses = isUser ? 'd-flex justify-content-end' : 'd-flex justify-content-start';
  
    return (
      <div className={`${containerClasses} mb-2`}>
        <div className={`p-2 rounded-lg ${bubbleClasses} relative`}>
          <ReactMarkdown>{message}</ReactMarkdown>
          <div
            className={`w-4 h-4 absolute top-0 mt-2 rounded-bl-lg ${tailClasses}`}
          />
        </div>
      </div>
    );
};

export default ChatBubble;
