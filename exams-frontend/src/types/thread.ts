import type { z } from "zod";
import type { MessageSchema, ThreadSchema } from "../schemas/thread";

export type Message = z.infer<typeof MessageSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
