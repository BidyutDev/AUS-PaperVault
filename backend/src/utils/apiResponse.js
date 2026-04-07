import { STATUS_CODES } from "./statusCodes.js";

export const sendSuccess = (
    res,
    message = "Success",
    status = STATUS_CODES.SUCCESS,
    data = null
) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (
    res,
    message = "Error",
    status = STATUS_CODES.SERVER_ERROR,
    error = null
) => {
    return res.status(status).json({
        success: false,
        message,
        error,
    });
};
