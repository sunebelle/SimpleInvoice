import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Please fill in all fields."),
  password: z.string().min(1, "Please fill in all fields."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
