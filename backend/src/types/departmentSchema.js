import z from "zod";

export const departmentSchema = z.object({
    fullName: z.string(),
    shortName: z.string(),
    semesters: z.number(),
    color: z.string().optional(),
    years: z.number(),
});
