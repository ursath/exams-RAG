import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Message as MessageType } from "../types/thread";

type MessageProps = {
	message: MessageType;
};

export const Message = ({ message }: MessageProps) => {
	const isUser = message.role === "user";

	return (
		<div
			className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 animate-fade-in`}
		>
			<div
				className={`max-w-3xl rounded-2xl px-6 py-4 ${
					isUser
						? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
						: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
				}`}
			>
				{isUser ? (
					<p className="text-base leading-relaxed whitespace-pre-wrap">
						{message.content}
					</p>
				) : (
					<div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-code:bg-gray-200 dark:prose-code:bg-gray-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-200 dark:prose-pre:bg-gray-700 prose-pre:p-4 prose-pre:rounded-lg">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeRaw]}
						>
							{message.content}
						</ReactMarkdown>
					</div>
				)}
			</div>
		</div>
	);
};
