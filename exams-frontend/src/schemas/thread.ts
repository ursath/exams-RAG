import { z } from "zod";
import { ExamTypeSchema } from "./exam";

export const MessageSchema = z.object({
	content: z.string(),
	id: z.string(),
	role: z.enum(["user", "assistant"]),
	timestamp: z.number(),
});

export const ThreadSchema = z.object({
	createdAt: z.number(),
	examType: ExamTypeSchema,
	id: z.string(),
	messages: z.array(MessageSchema),
	subject: z.string(),
	title: z.string(),
	updatedAt: z.number(),
});
