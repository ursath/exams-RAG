import { z } from "zod";

export const ExamTypeSchema = z.enum(["midterm1", "midterm2", "final"]);

export const SubjectInfoSchema = z.object({
	i18n: z.object({
		en: z.string(),
		es: z.string(),
	}),
	subject: z.string(),
});

export const ExamRequestSchema = z.object({
	subject: z.string(),
	type: z.enum(["final", "midterm1", "midterm2"]),
});

export const ExamResponseSchema = z.object({
	content: z.string(),
	examType: ExamTypeSchema,
	subject: z.string(),
	timestamp: z.string(),
});

export const StreamChunkSchema = z.object({
	content: z.string(),
	done: z.boolean(),
});
