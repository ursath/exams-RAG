import type { z } from "zod";
import type {
	ExamRequestSchema,
	ExamResponseSchema,
	ExamTypeSchema,
	StreamChunkSchema,
	SubjectInfoSchema,
} from "../schemas/exam";

export type ExamType = z.infer<typeof ExamTypeSchema>;
export type SubjectInfo = z.infer<typeof SubjectInfoSchema>;
export type ExamRequest = z.infer<typeof ExamRequestSchema>;
export type ExamResponse = z.infer<typeof ExamResponseSchema>;
export type StreamChunk = z.infer<typeof StreamChunkSchema>;
