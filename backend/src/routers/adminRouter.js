import { Router } from "express";
import adminSchema from "../types/adminSchema.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import checkAdmin from "../utils/checkAdmin.js";
import { getRole } from "../utils/getRole.js";

const adminRouter = Router();

adminRouter.post("/auth", (req, res) => {
    const { success } = adminSchema.safeParse(req.body);
    if (!success) return sendError(res, "", STATUS_CODES.BAD_REQUEST);

    const { username, password } = req.body;
    const isAdmin = checkAdmin(username, password);

    if (!isAdmin) {
        return sendError(res, "Unauthorized access", STATUS_CODES.UNAUTHORIZED);
    }
    return sendSuccess(res, "Logged in successfully", STATUS_CODES.SUCCESS, {
        username,
        role: getRole(username),
    });
});

export default adminRouter;
