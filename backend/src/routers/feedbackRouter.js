import { Router } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import { feedbackSchema } from "../types/feedbackSchema.js";
import Feedback from "../models/feedback.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ROLES } from "../roles.js";

const feedbackRouter = Router();

feedbackRouter.post("/send", authMiddleware, async (req, res) => {
    try {
        const { success, error, data } = feedbackSchema.safeParse(req.body);

        if (!success) {
            return sendError(
                res,
                "Invalid body",
                STATUS_CODES.BAD_REQUEST,
                error.message
            );
        }

        await Feedback.create({
            user: res.user._id,
            username: res.user.username,
            email: res.user.email,
            message: data.message,
        });

        sendSuccess(res, "Feedback sent successfully", STATUS_CODES.SUCCESS, {
            username: res.user.username,
            email: res.user.email,
        });
    } catch (err) {
        sendError(
            res,
            "Error in sending feedback",
            STATUS_CODES.SERVER_ERROR,
            err
        );
    }
});

feedbackRouter.get("/list", authMiddleware, async (req, res) => {
    try {
        if (
            res.user.role == ROLES.SUPER_ADMIN ||
            res.user.role == ROLES.MODERATOR
        ) {
            const feedbacks = await Feedback.find();
            sendSuccess(
                res,
                "Feedback fetched successfully",
                STATUS_CODES.SUCCESS,
                { feedbacks }
            );
        } else {
            sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (err) {
        sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

feedbackRouter.delete("/delete", authMiddleware, async (req, res) => {
    try {
        if (
            res.user.role == ROLES.SUPER_ADMIN ||
            res.user.role == ROLES.MODERATOR
        ) {
            await Feedback.deleteOne({});
        } else {
            sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (err) {
        sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

export default feedbackRouter;
