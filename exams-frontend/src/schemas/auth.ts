import { z } from "zod";

export const AuthInfoSchema = z.object({
	accessToken: z.string().optional(),
	email: z.string().optional(),
	idToken: z.string().optional(),
	name: z.string().optional(),
	scopes: z.array(z.string()),
	username: z.string().optional(),
});
