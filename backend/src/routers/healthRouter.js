import { Router } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import mongoose from "mongoose";

const healthRouter = Router();

healthRouter.get("/", (req, res) => {
    try {
        const uptime = Math.floor(process.uptime());
        const mongoState = mongoose.connection.readyState;

        const dbStatus = mongoState == 1 ? "up" : "down";

        if (dbStatus == "up") {
            return sendSuccess(res, "Server is healthy", STATUS_CODES.SUCCESS, {
                uptime: `${Math.floor(uptime / 60)} mins ${uptime % 60} seconds`,
                database: dbStatus,
            });
        }

        sendError(res, "Mongo DB is down", STATUS_CODES.SERVER_ERROR);
    } catch (err) {
        sendError(res, "Server is unhealthy", STATUS_CODES.SERVER_ERROR, err);
    }
});

export default healthRouter;
