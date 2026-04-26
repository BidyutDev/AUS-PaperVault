import z from "zod";

export const departmentSchema = z.object({
    fullName: z.string(),
    shortName: z.string(),
    semesters: z.record(z.string(), z.array(z.string())),
    color: z.string().optional(),
    iconName: z.string().optional().default("Monitor"),
    years: z.array(z.number().optional()),
});

export const departmentUpdateSchema = z.object({
    fullName: z.string().optional(),
    shortName: z.string().optional(),
    color: z.string().optional(),
    semesterCount: z.number().optional(),
    iconName: z.string().optional(),
});


export const departmentSubjectSchema = z.object({
    deptId: z.string(),
    semester: z.enum(["1" , "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "11" , "12" , "13" , "14" , "15"]),
    subject: z.string(),
    newSubject: z.string().optional(),
});

export const departmentSemesterSchema = z.object({
    deptId: z.string(),
    semester: z.string(),
})