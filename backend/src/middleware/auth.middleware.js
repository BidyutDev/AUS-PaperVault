import { ACCESS_TOKEN_SECRET } from "../config.js";
import { sendError } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    const header = req.headers.authorization;

    if (!header) {
        return sendError(res, "No headers provided", STATUS_CODES.BAD_REQUEST);
    }
    const token = header.split(" ")[1];

    if (!token) {
        return sendError(res, "Invalid token", STATUS_CODES.BAD_REQUEST);
    }
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        if (decoded) {
            req.user = decoded;
            return next();
        }
        sendError(res, "No data in token", STATUS_CODES.FORBIDDEN);
    } catch (err) {
        if (err.name == "TokenExpiredError") {
            return sendError(
                res,
                "Token expired",
                STATUS_CODES.FORBIDDEN,
                err.name
            );
        }
        console.log(err);
        sendError(res, "Not a valid token", STATUS_CODES.FORBIDDEN, err);
    }
};
