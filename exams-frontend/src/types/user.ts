import type { z } from "zod";
import type { ContextSchema, UserAttributesSchema } from "../schemas/user";

export type UserAttributes = z.infer<typeof UserAttributesSchema>;
export type Context = z.infer<typeof ContextSchema>;
