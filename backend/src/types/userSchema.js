import z from "zod";

export const userSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    username: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    password: z.string(),
});
