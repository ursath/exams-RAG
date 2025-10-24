import { useEffect, useRef } from "react";
import type { Message as MessageType, Thread } from "../types/thread";
import { Message } from "./Message";
import { MessageLoader } from "./MessageLoader";

type ChatViewProps = {
	isGenerating: boolean;
	streamingMessage?: MessageType | null;
	thread: Thread;
};

export const ChatView = ({
	thread,
	isGenerating,
	streamingMessage,
}: ChatViewProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	});

	return (
		<div className="flex-1 flex flex-col h-screen bg-white dark:bg-gray-900">
			<div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
					{thread.title}
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
					{new Date(thread.createdAt).toLocaleString()}
				</p>
			</div>

			<div className="flex-1 overflow-y-auto p-6">
				{thread.messages
					.filter(
						(message) =>
							!streamingMessage || message.id !== streamingMessage.id,
					)
					.map((message) => (
						<Message key={message.id} message={message} />
					))}
				{streamingMessage?.content.trim() && (
					<Message key={streamingMessage.id} message={streamingMessage} />
				)}
				{isGenerating && <MessageLoader />}
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
};
