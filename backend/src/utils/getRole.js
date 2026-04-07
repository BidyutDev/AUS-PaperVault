import { ADMINS } from "../data/admins.js";

export const getRole = (username) => {
    let role = null;
    ADMINS.forEach((admin) => {
        if (admin.username == username) {
            role = admin.role;
        }
    });
    return role;
};
