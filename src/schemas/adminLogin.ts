import { z } from "zod"

export const adminLoginSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username must be less than 50 characters"),
    password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be less than 20 characters"),
}).strict();