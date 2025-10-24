import { useTranslation } from "react-i18next";
import type { Thread } from "../types/thread";

type ThreadListProps = {
	currentThreadId: string | null;
	onNewThread: () => void;
	onSelectThread: (threadId: string) => void;
	threads: Thread[];
};

export const ThreadList = ({
	threads,
	currentThreadId,
	onSelectThread,
	onNewThread,
}: ThreadListProps) => {
	const { t } = useTranslation();

	return (
		<div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
			<div className="p-4 border-b border-gray-200">
				<button
					type="button"
					onClick={onNewThread}
					className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>{t("examGenerator.newExam")}</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					{t("examGenerator.newExam")}
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-2">
				{threads.length === 0 ? (
					<div className="text-center text-gray-500 mt-8 px-4">
						<p className="text-sm">{t("examGenerator.noThreads")}</p>
					</div>
				) : (
					<div className="space-y-1">
						{threads.map((thread) => (
							<button
								key={thread.id}
								type="button"
								onClick={() => onSelectThread(thread.id)}
								className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
									currentThreadId === thread.id
										? "bg-white shadow-md border-l-4 border-blue-500"
										: "hover:bg-white hover:shadow-sm"
								}`}
							>
								<h3 className="font-semibold text-sm text-gray-800 truncate">
									{thread.title}
								</h3>
								<p className="text-xs text-gray-500 mt-1">
									{new Date(thread.updatedAt).toLocaleDateString()}
								</p>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
