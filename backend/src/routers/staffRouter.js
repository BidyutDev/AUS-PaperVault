import { Router } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import checkStaff from "../utils/checkStaff.js";
import staffSchema from "../types/staffSchema.js";

const staffRouter = Router();

staffRouter.post("/auth", async (req, res) => {
    const { success } = staffSchema.safeParse(req.body);
    if (!success) return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);

    const { username, password , role} = req.body;
    const data = await checkStaff(username, password , role);

    if (!data.isStaff) {
        return sendError(res, "Unauthorized access", STATUS_CODES.UNAUTHORIZED);
    }
    return sendSuccess(res, "Logged in successfully", STATUS_CODES.SUCCESS, {
        username,
        role: data.role,
    });
});

export default staffRouter;
