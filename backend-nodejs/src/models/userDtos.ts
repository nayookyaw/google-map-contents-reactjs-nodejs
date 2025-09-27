import { z } from "zod";

export const CreateUserDto = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).default("VIEWER"),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;