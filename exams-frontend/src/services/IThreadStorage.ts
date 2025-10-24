import type { Thread } from "../types/thread";

export interface IThreadStorage {
	createThread(thread: Thread): Promise<void>;
	deleteThread(id: string): Promise<void>;
	getAllThreads(): Promise<Thread[]>;
	getThread(id: string): Promise<Thread | undefined>;
	updateThread(thread: Thread): Promise<void>;
}
