import { Router } from "express";
import multerUpload from "../config/multer.js";
import { uploadSchema } from "../types/uploadSchema.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";

const fileRouter = Router();

fileRouter.post("/upload", multerUpload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return sendError(
                res,
                "No file uploaded",
                STATUS_CODES.BAD_REQUEST
            );
        }
        const { success , error , data} = uploadSchema.safeParse(req.body);

        if (!success) {
            return sendError(
                res,
                "Validation failed",
                STATUS_CODES.BAD_REQUEST,
                error
            );
        }

        return sendSuccess(
            res,
            "File uploaded successfully",
            STATUS_CODES.CREATED,
            {
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                path: req.file.path,
                ...data,
            }
        );
    } catch (err) {
        console.error("Upload error:", err);
        return sendError(
            res,
            "File upload failed",
            STATUS_CODES.SERVER_ERROR,
            err
        );
    }
});

export default fileRouter;
