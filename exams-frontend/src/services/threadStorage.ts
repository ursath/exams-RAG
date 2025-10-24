import { IndexedDBThreadStorage } from "./IndexedDBThreadStorage";
import type { IThreadStorage } from "./IThreadStorage";

let storageInstance: IThreadStorage | null = null;

export const getThreadStorage = (): IThreadStorage => {
	if (!storageInstance) {
		storageInstance = new IndexedDBThreadStorage();
	}
	return storageInstance;
};
