import z from "zod";

export const departmentSchema = z.object({
    fullName: z.string(),
    shortName: z.string(),
    semesters: z.record(z.string(), z.array(z.string())),
    color: z.string().optional(),
    iconName: z.enum(["Monitor", "Cpu", "Zap", "Cog", "Building2", "Atom", "FlaskConical", "Calculator", "BookOpen", "Languages", "Landmark", "TrendingUp", "Briefcase", "Leaf", "Microscope"]).optional().default("Monitor"),
    years: z.array(z.number().optional()),
});

export const departmentUpdateSchema = z.object({
    fullName: z.string().optional(),
    shortName: z.string().optional(),
    color: z.string().optional(),
    semesterCount: z.number().optional(),
});