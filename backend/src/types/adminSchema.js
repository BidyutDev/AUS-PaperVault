import z from "zod";

const adminSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default adminSchema;
