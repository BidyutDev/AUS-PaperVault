import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ROLES } from "../roles.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import Notification from "../models/notification.model.js";
import { notificationSchema } from "../types/notificationSchema.js";
import { io } from "../index.js";
import { sendGlobalNotificationEmail } from "../services/email.js";
import User from "../models/user.model.js";
import imageMulter from "../config/imageMulter.js";

const notificationRouter = Router();

// Upload image for notification
notificationRouter.post("/upload-image", authMiddleware, imageMulter.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, "No image uploaded", STATUS_CODES.BAD_REQUEST);
        }
        
        // Return the relative path that can be accessed via static middleware
        const imageUrl = `/uploads/notifications/${req.file.filename}`;
        sendSuccess(res, "Image uploaded", STATUS_CODES.SUCCESS, { imageUrl });
    } catch (err) {
        sendError(res, "Upload failed", STATUS_CODES.SERVER_ERROR, err.message);
    }
});

// Create a new global notification (Admins only)
notificationRouter.post("/create", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== ROLES.SUPER_ADMIN && req.user.role !== ROLES.MODERATOR) {
            return sendError(res, "Unauthorized", STATUS_CODES.UNAUTHORIZED);
        }

        const { success, data, error } = notificationSchema.safeParse(req.body);
        if (!success) {
            return sendError(res, "Invalid input", STATUS_CODES.BAD_REQUEST, error);
        }

        const notification = await Notification.create({
            ...data,
            createdBy: req.user._id,
        });

        // Broadcast via WebSocket
        io.emit("global_notification", notification);

        // Send Emails (in the background)
        const allUsers = await User.find({}, "email");
        const emails = allUsers.map(u => u.email).filter(e => e);
        
        if (emails.length > 0) {
            sendGlobalNotificationEmail(emails, notification).catch(err => {
                console.error("Failed to send global emails:", err);
            });
        }

        sendSuccess(res, "Notification published successfully", STATUS_CODES.CREATED, notification);
    } catch (err) {
        console.error("Notification creation error:", err);
        sendError(res, "Server error", STATUS_CODES.SERVER_ERROR, err.message);
    }
});

// List all global notifications (Public)
notificationRouter.get("/list", async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(20);
            
        sendSuccess(res, "Notifications fetched", STATUS_CODES.SUCCESS, notifications);
    } catch (err) {
        sendError(res, "Server error", STATUS_CODES.SERVER_ERROR, err.message);
    }
});

export default notificationRouter;
