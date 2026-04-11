import getUserByRoles from "../data/staff.js";
import { ROLES } from "../roles.js";

const checkStaff = async (username, password, role) => {
    try {
        let isStaff = false;

        const admins = await getUserByRoles([role]);

        for (const admin of admins) {
            const isValidPassword = await admin.comparePassword(password);
            if (admin.username == username && isValidPassword) {
                isStaff = true;
            }
        }

        return { isStaff, role };
    } catch (err) {
        role = ROLES.MEMBER;
        return { isStaff: false, role };
    }
};

export default checkStaff;
