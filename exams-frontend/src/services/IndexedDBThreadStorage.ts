import Dexie, { type EntityTable } from "dexie";
import type { Thread } from "../types/thread";
import type { IThreadStorage } from "./IThreadStorage";

class ExamThreadDatabase extends Dexie {
	threads!: EntityTable<Thread, "id">;

	constructor() {
		super("ExamThreadDatabase");
		this.version(1).stores({
			threads: "id, createdAt, updatedAt, examType, subject",
		});
	}
}

const db = new ExamThreadDatabase();

export class IndexedDBThreadStorage implements IThreadStorage {
	async createThread(thread: Thread): Promise<void> {
		await db.threads.add(thread);
	}

	async getThread(id: string): Promise<Thread | undefined> {
		return await db.threads.get(id);
	}

	async getAllThreads(): Promise<Thread[]> {
		return await db.threads.orderBy("updatedAt").reverse().toArray();
	}

	async updateThread(thread: Thread): Promise<void> {
		await db.threads.put(thread);
	}

	async deleteThread(id: string): Promise<void> {
		await db.threads.delete(id);
	}
}
