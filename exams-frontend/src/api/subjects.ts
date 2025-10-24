import type { SubjectInfo } from "../types/exam";
import { apiClient } from "./client";

export const subjectsApi = {
	getSubjects: async (): Promise<SubjectInfo[]> => {
		return apiClient.get<SubjectInfo[]>("/subjects");
	},
};
