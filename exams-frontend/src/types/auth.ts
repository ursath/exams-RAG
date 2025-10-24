import type { z } from "zod";
import type { AuthInfoSchema } from "../schemas/auth";

export type AuthInfo = z.infer<typeof AuthInfoSchema>;
