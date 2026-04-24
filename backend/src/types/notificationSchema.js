import z from "zod";

export const notificationSchema = z.object({
    title: z.string().min(3).max(100),
    message: z.string().min(5).max(1000),
    link: z.string().url().optional().or(z.literal("")),
    imageUrl: z.string().optional().or(z.literal("")),
    type: z.enum(["info", "alert", "announcement", "maintenance"]).optional(),
});
