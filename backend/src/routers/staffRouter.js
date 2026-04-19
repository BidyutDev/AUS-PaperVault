import { Router } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import checkStaff from "../utils/checkStaff.js";
import staffSchema, { updateStaffSchema } from "../types/staffSchema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import { ROLES } from "../roles.js";

const staffRouter = Router();

staffRouter.post("/auth", async (req, res) => {
    const { success } = staffSchema.safeParse(req.body);
    if (!success)
        return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);

    const { username, password, role } = req.body;
    const data = await checkStaff(username, password, role);

    if (!data.isStaff) {
        return sendError(res, "Unauthorized access", STATUS_CODES.UNAUTHORIZED);
    }
    return sendSuccess(res, "Logged in successfully", STATUS_CODES.SUCCESS, {
        username,
        role: data.role,
    });
});

staffRouter.get("/user-list", authMiddleware, async (req, res) => {
    try {
        if (req.user.role != ROLES.SUPER_ADMIN) {
            return sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }

        const users = await User.find();
        sendSuccess(res, "Users fetched successfully", STATUS_CODES.SUCCESS, {
            users,
        });
    } catch (err) {
        sendError(
            res,
            "Error in fetching data",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

staffRouter.get("/staff-list", authMiddleware, async (req, res) => {
    try {
        if (req.user.role != ROLES.SUPER_ADMIN) {
            return sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }

        const staff = await User.find({ role: { $ne: ROLES.MEMBER } });
        sendSuccess(res, "Users fetched successfully", STATUS_CODES.SUCCESS, {
            staff,
        });
    } catch (err) {
        sendError(
            res,
            "Error in fetching data",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

staffRouter.post("/update-stuff", authMiddleware, async (req, res) => {
    try {
        if (req.user.role != ROLES.SUPER_ADMIN) {
            return sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }

        const { success, data } = updateStaffSchema.safeParse(req.body);

        if (!success) {
            return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);
        }

        const user = await User.findOne({ username: data.username });
        if (user.role == ROLES.SUPER_ADMIN) {
            return sendError(
                res,
                "Cannot update root user",
                STATUS_CODES.FORBIDDEN
            );
        }
        user.role = data.role;
        await user.save();

        sendSuccess(res, "User updated successfully", STATUS_CODES.SUCCESS);
    } catch (err) {
        sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

export default staffRouter;
