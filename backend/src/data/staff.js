import User from "../models/user.model.js";

const getUserByRoles = async (roles = []) => {
    try {
        const query = roles.length ? { roles: { $in: roles } } : {};
        const users = await User.find(query).select(
            " -refreshTokenExpiry -refreshToken -phoneNumber"
        );

        return users;
    } catch (err) {
        console.log(err.message);
        return [];
    }
};

export default getUserByRoles;
