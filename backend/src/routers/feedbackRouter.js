import { Router } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import { feedbackSchema } from "../types/feedbackSchema.js";
import Feedback from "../models/feedback.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ROLES } from "../roles.js";
import { io } from "../index.js";

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

        const existingFeedback = await Feedback.findOne({
            $or: [{ username: req.user.username }, { email: req.user.email }],
        });

        if (existingFeedback) {
            return sendError(
                res,
                "You already have an active feedback. Please update your existing feedback instead.",
                STATUS_CODES.BAD_REQUEST
            );
        }

        await Feedback.create({
            user: req.user._id,
            username: req.user.username,
            email: req.user.email,
            message: data.message,
        });

        const preview =
            data.message.length > 120
                ? `${data.message.slice(0, 120)}…`
                : data.message;
        io.emit("admin_realtime_notification", {
            audience: "moderators_and_super",
            type: "feedback",
            title: "New user feedback",
            body: preview
                ? `${req.user.username}: ${preview}`
                : `${req.user.username} submitted feedback.`,
            linkTab: "feedback",
            meta: { name: req.user.username, preview },
        });

        io.emit("feedback_list_updated");

        sendSuccess(res, "Feedback sent successfully", STATUS_CODES.SUCCESS, {
            username: req.user.username,
            email: req.user.email,
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

feedbackRouter.get("/me", authMiddleware, async (req, res) => {
    try {
        const feedback = await Feedback.findOne({
            $or: [{ username: req.user.username }, { email: req.user.email }],
        });

        sendSuccess(
            res,
            "Feedback fetched successfully",
            STATUS_CODES.SUCCESS,
            {
                feedback,
            }
        );
    } catch (err) {
        sendError(
            res,
            "Error fetching feedback",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

feedbackRouter.get("/list", authMiddleware, async (req, res) => {
    try {
        if (
            req.user.role == ROLES.SUPER_ADMIN ||
            req.user.role == ROLES.MODERATOR
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

feedbackRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role == ROLES.SUPER_ADMIN) {
            const { id } = req.params;
            const deleteFeedback = await Feedback.deleteOne({ _id: id });

            if (deleteFeedback.deletedCount != 0) {
                io.emit("feedback_list_updated");
                return sendSuccess(
                    res,
                    "Feedback deleted successfully",
                    STATUS_CODES.SUCCESS
                );
            }
            sendError(res, "No feedback found", STATUS_CODES.NOT_FOUND);
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

feedbackRouter.post("/edit", authMiddleware, async (req, res) => {
    try {
        if (
            req.user.role == ROLES.SUPER_ADMIN ||
            req.user.role == ROLES.MODERATOR
        ) {
            const user = await Feedback.findOne({
                $or: [
                    { username: req.user.username },
                    { email: req.user.email },
                ],
            });

            if (!user) {
                return sendError(
                    res,
                    "No feedback exists with the user",
                    STATUS_CODES.NOT_FOUND
                );
            }

            user.message = req.body.editedMessage;
            await user.save();
            sendSuccess(
                res,
                "Feedback edited successfully",
                STATUS_CODES.SUCCESS,
                {
                    message: user.message,
                }
            );
        } else {
            sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (err) {
        console.log(err.message);
        sendError(
            res,
            "Error in editing feedback",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

export default feedbackRouter;
