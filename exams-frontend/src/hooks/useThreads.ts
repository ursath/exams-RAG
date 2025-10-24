import { useCallback, useEffect, useState } from "react";
import { getThreadStorage } from "../services/threadStorage";
import type { ExamType } from "../types/exam";
import type { Message, Thread } from "../types/thread";

export const useThreads = () => {
	const [threads, setThreads] = useState<Thread[]>([]);
	const [currentThread, setCurrentThread] = useState<Thread | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const storage = getThreadStorage();

	const loadThreads = useCallback(async () => {
		setIsLoading(true);
		try {
			const allThreads = await storage.getAllThreads();
			setThreads(allThreads);
		} catch (error) {
			console.error("Failed to load threads:", error);
		} finally {
			setIsLoading(false);
		}
	}, [storage]);

	useEffect(() => {
		loadThreads();
	}, [loadThreads]);

	const createThread = useCallback(
		async (
			examType: ExamType,
			subject: string,
			title?: string,
		): Promise<Thread> => {
			const now = Date.now();
			const thread: Thread = {
				createdAt: now,
				examType,
				id: `thread-${now}-${Math.random().toString(36).slice(2, 9)}`,
				messages: [],
				subject,
				title: title || `${examType} - ${subject}`,
				updatedAt: now,
			};

			await storage.createThread(thread);
			await loadThreads();
			setCurrentThread(thread);
			return thread;
		},
		[storage, loadThreads],
	);

	const addMessage = useCallback(
		async (threadId: string, message: Message): Promise<void> => {
			const thread =
				currentThread?.id === threadId
					? currentThread
					: await storage.getThread(threadId);
			if (!thread) return;

			const updatedThread: Thread = {
				...thread,
				messages: [...thread.messages, message],
				updatedAt: Date.now(),
			};

			setCurrentThread(updatedThread);

			await storage.updateThread(updatedThread);

			setThreads((prev) =>
				prev.map((t) => (t.id === threadId ? updatedThread : t)),
			);
		},
		[storage, currentThread],
	);

	const deleteThread = useCallback(
		async (threadId: string): Promise<void> => {
			await storage.deleteThread(threadId);
			await loadThreads();

			if (currentThread?.id === threadId) {
				setCurrentThread(null);
			}
		},
		[storage, loadThreads, currentThread],
	);

	const selectThread = useCallback(
		async (threadId: string): Promise<void> => {
			const thread = await storage.getThread(threadId);
			setCurrentThread(thread || null);
		},
		[storage],
	);

	return {
		addMessage,
		createThread,
		currentThread,
		deleteThread,
		isLoading,
		selectThread,
		setCurrentThread,
		threads,
	};
};
