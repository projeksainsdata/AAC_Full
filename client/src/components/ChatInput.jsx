import React, { useState } from 'react';

const ChatInput = ({ onSubmit }) => {
	const [message, setMessage] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		onSubmit(message);
		setMessage('');
	};

	return (
		<form onSubmit={handleSubmit} className="flex items-center gap-4">
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Ketik pertanyaanmu disini..."
				className="flex-grow border-2 bg-grey border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-300"
			/>
			<button type="submit" className="px-2 py-1 bg-gradient-to-r from-green-400 via-teal-500 to-purple-500 rounded-lg text-white">
				Kirim
			</button>
		</form>
	);
};

export default ChatInput;