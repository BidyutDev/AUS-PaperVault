/* This is an example file . Create a admins.js file in data section and add like this*/

import { ROLES } from "../roles.js";

export const ADMINS = [
    {
        username: "admin",
        password: "admin",
        role: ROLES.SUPER_ADMIN,
    },
];

