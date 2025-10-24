export const MessageLoader = () => {
	return (
		<div className="flex justify-start mb-6">
			<div className="max-w-3xl rounded-2xl px-6 py-4 bg-gray-100 border border-gray-200">
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
					<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
					<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
				</div>
			</div>
		</div>
	);
};
