import type { AuthUser } from "aws-amplify/auth";
import { z } from "zod";

export const UserAttributesSchema = z.object({
	email: z.string().optional(),
	name: z.string().optional(),
});

export const ContextSchema = z.object({
	currentUser: z.custom<AuthUser>().nullable(),
	isLoading: z.boolean(),
	setCurrentUser: z.function(),
	userAttributes: UserAttributesSchema.nullable(),
});
