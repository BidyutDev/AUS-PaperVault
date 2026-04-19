import { Router } from "express";
import multerUpload from "../config/multer.js";
import { uploadSchema } from "../types/uploadSchema.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import File from "../models/file.model.js";

const fileRouter = Router();

fileRouter.post(
    "/upload",
    authMiddleware,
    multerUpload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return sendError(
                    res,
                    "No file uploaded",
                    STATUS_CODES.BAD_REQUEST
                );
            }
            const { success, error, data } = uploadSchema.safeParse(req.body);

            if (!success) {
                return sendError(
                    res,
                    "Validation failed",
                    STATUS_CODES.BAD_REQUEST,
                    error
                );
            }
            const newFile = await File.create({}); // will change it too
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
    }
);

fileRouter.post("/action/:status/:id", authMiddleware, async (req, res) => {
    try {
        const { id: fileId, status } = req.params;

        const file = await File.findById(fileId);

        if (!file) {
            return sendError(res, "File not found", STATUS_CODES.NOT_FOUND);
        }

        file.isApproved = status === "approve" ? true : false;
        file.approvedBy = req.user._id;
        if (!file.isApproved) {
            await file.deleteOne();
            return sendSuccess(
                res,
                "File rejected successfully",
                STATUS_CODES.SUCCESS
            ); // might the data part will get changed
        }

        await file.save();

        sendSuccess(res, "File approved successfully", STATUS_CODES.SUCCESS, {
            file,
        }); // might the data part will get changed
    } catch (err) {
        console.log(err);
        sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

fileRouter.get("/pending", authMiddleware, async (req, res) => {
    try {
        // I have to add something here more but not adding right now coz i have to check it with the frontend

        const pendingFiles = await File.find({ isApproved: false });
        sendSuccess(
            res,
            "Pending files fetched successfully",
            STATUS_CODES.SUCCESS,
            {
                pendingFiles,
            }
        ); // might the data part will get changed
    } catch (err) {
        console.log(err);
        sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

export default fileRouter;
