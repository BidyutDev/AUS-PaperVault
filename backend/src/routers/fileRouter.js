import { Router } from "express";
import multerUpload from "../config/multer.js";
import { uploadSchema } from "../types/uploadSchema.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import File from "../models/file.model.js";
import { io } from "../index.js";
import Department from "../models/department.model.js";

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
            const newFile = await File.create({
                department: data.department,
                semester: data.semester,
                year: data.year,
                subject: data.subject,
                uploadedBy: req.user._id,
                path: req.file.path,
                fileName: req.file.filename,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                isAnonymous: data.isAnonymous === "true",
            });
            await Department.findOneAndUpdate(
                { fullName: data.department },
                { $addToSet: { years: data.year } }
            )
            // Emits notification over web sockets globally
            io.emit("admin_realtime_notification", {
                audience: "all_staff",
                type: "paper_upload",
                title: "New question paper upload",
                body: `A paper was submitted for review — ${req.file.originalname}.`,
                linkTab: "review",
                meta: {
                    fileName: newFile.fileName,
                    ...data,
                },
            });

            return sendSuccess(
                res,
                "File uploaded successfully",
                STATUS_CODES.CREATED,
                {
                    fileName: newFile.fileName,
                    fileSize: newFile.fileSize,
                    mimeType: newFile.mimeType,
                    path: newFile.path,
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
        file.approvedAt = new Date();
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

fileRouter.post("/download/:id", async (req, res) => {
    try {
        const { id: fileId } = req.params;
        const file = await File.findById(fileId);

        if (!file) {
            return sendError(res, "File not found", STATUS_CODES.NOT_FOUND);
        }

        file.downloadCount += 1;
        await file.save();

        sendSuccess(res, "Download count incremented", STATUS_CODES.SUCCESS, {
            downloadCount: file.downloadCount,
        });
    } catch (err) {
        console.error("Increment download error:", err);
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

        const pendingFiles = await File.find({ isApproved: false }).populate("uploadedBy", "firstName lastName username").lean();
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

fileRouter.get("/list", async (req, res) => {
    try {
        const approvedFiles = await File.find({ isApproved: true })
            .populate("uploadedBy", "firstName lastName username")
            .lean();
        
        // Format the files to match the frontend expectations
        const formattedFiles = approvedFiles.map(f => ({
            id: f._id,
            department: f.department,
            semester: f.semester,
            year: f.year,
            subject: f.subject,
            fileName: f.fileName,
            fileSize: f.fileSize,
            mimeType: f.mimeType,
            path: f.path,
            isApproved: f.isApproved,
            isAnonymous: f.isAnonymous,
            uploaderName: f.isAnonymous ? "Anonymous" : 
                (f.uploadedBy ? (f.uploadedBy.username || `${f.uploadedBy.firstName} ${f.uploadedBy.lastName}`) : "Admin"),
            downloadCount: f.downloadCount || 0,
            createdAt: f.createdAt,
        }));

        sendSuccess(
            res,
            "Approved files fetched successfully",
            STATUS_CODES.SUCCESS,
            {
                papers: formattedFiles,
            }
        );
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

fileRouter.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        const { id: fileId } = req.params;
        const { department, semester, year } = req.body;

        const file = await File.findById(fileId);

        if (!file) {
            return sendError(res, "File not found", STATUS_CODES.NOT_FOUND);
        }

        if (department) file.department = department;
        if (semester) file.semester = semester;
        if (year) file.year = year;

        await file.save();

        sendSuccess(res, "File updated successfully", STATUS_CODES.SUCCESS, {
            file,
        });
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

fileRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const { id: fileId } = req.params;
        const file = await File.findById(fileId);

        if (!file) {
            return sendError(res, "File not found", STATUS_CODES.NOT_FOUND);
        }

        await file.deleteOne();

        sendSuccess(res, "File deleted successfully", STATUS_CODES.SUCCESS);
    } catch (err) {
        console.error("Delete error:", err);
        sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

// ─── Analytics Aggregation ──────────────────────────────────
fileRouter.get("/analytics", authMiddleware, async (req, res) => {
    try {
        // Dynamic imports to avoid circular deps
        const User = (await import("../models/user.model.js")).default;
        const Feedback = (await import("../models/feedback.model.js")).default;
        const Department = (await import("../models/department.model.js")).default;

        // ── Core counts (parallel) ──
        const [totalUploads, pendingReview, approved, totalUsers, totalFeedback, departments] =
            await Promise.all([
                File.countDocuments(),
                File.countDocuments({ isApproved: false }),
                File.countDocuments({ isApproved: true }),
                User.countDocuments(),
                Feedback.countDocuments(),
                Department.find({}).lean(),
            ]);

        // ── Total downloads ──
        const dlAgg = await File.aggregate([
            { $group: { _id: null, total: { $sum: "$downloadCount" } } },
        ]);
        const totalDownloads = dlAgg.length > 0 ? dlAgg[0].total : 0;

        // ── Papers per department ──
        const deptAgg = await File.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: "$department", papers: { $sum: 1 } } },
        ]);

        // Map aggregation results to department shortNames
        const departmentStats = departments.map((dept) => {
            const match = deptAgg.find((d) => d._id === dept.fullName || d._id === dept.shortName);
            return {
                name: dept.shortName,
                fullName: dept.fullName,
                papers: match ? match.papers : 0,
            };
        });

        // ── Weekly upload distribution (last 30 days) ──
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const weeklyAgg = await File.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" }, // 1=Sun … 7=Sat
                    uploads: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklyTraffic = dayNames.map((name, i) => {
            const match = weeklyAgg.find((d) => d._id === i + 1);
            return { name, uploads: match ? match.uploads : 0 };
        });

        // ── Recent uploads (last 5) ──
        const recentUploads = await File.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("uploadedBy", "username firstName lastName")
            .lean();

        const recentFormatted = recentUploads.map((f) => ({
            id: f._id,
            fileName: f.fileName,
            department: f.department,
            semester: f.semester,
            subject: f.subject,
            year: f.year,
            isApproved: f.isApproved,
            uploadedBy: f.uploadedBy
                ? f.uploadedBy.username || `${f.uploadedBy.firstName} ${f.uploadedBy.lastName}`
                : "Unknown",
            createdAt: f.createdAt,
        }));

        return sendSuccess(res, "Analytics fetched successfully", STATUS_CODES.SUCCESS, {
            analytics: {
                totalUploads,
                pendingReview,
                approved,
                totalDownloads,
                totalUsers,
                totalFeedback,
                departmentStats,
                weeklyTraffic,
                recentUploads: recentFormatted,
            },
        });
    } catch (err) {
        console.error("Analytics error:", err);
        return sendError(
            res,
            "Failed to fetch analytics",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

export default fileRouter;
