import z from "zod";
import { ROLES } from "../roles.js";

const staffSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum([
        ROLES.SUPER_ADMIN,
        ROLES.MODERATOR,
        ROLES.REVIEWER,
        ROLES.MEMBER,
    ]),
});

export default staffSchema;
