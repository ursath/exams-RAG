import type { ExamRequest, ExamResponse } from "../types/exam";
import { apiClient } from "./client";

export const examApi = {
	generateExam: async (request: ExamRequest): Promise<ExamResponse> => {
		return apiClient.post<ExamResponse>("/prompt", request);
	},

	streamExam: async (
		request: ExamRequest,
		handlers: {
			onToken: (token: string) => void;
			onError?: (error: string) => void;
			onRetry?: (retryInSeconds: number) => void;
			onPause?: (shouldContinue: boolean) => void;
		},
		signal?: AbortSignal,
	): Promise<void> => {
		return apiClient.stream("/prompt", request, handlers, signal);
	},
};
