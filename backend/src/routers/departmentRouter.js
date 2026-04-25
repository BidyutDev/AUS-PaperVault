import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ROLES } from "../roles.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import Department from "../models/department.model.js";
import { departmentSchema, departmentUpdateSchema } from "../types/departmentSchema.js";
import { STATUS_CODES } from "../utils/statusCodes.js";

const departmentRouter = Router();

departmentRouter.post("/add", authMiddleware, async (req, res) => {
    try {
        if (
            req.user.role == ROLES.SUPER_ADMIN ||
            req.user.role == ROLES.MODERATOR
        ) {
            const { success, data } = departmentSchema.safeParse(req.body);
            if (!success) {
                return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);
            }
            await Department.create({
                fullName: data.fullName,
                shortName: data.shortName,
                semesters: data.semesters,
                color: data.color || "#000",
                iconName: data.iconName || "Monitor",
                years: data.years,
            });

            sendSuccess(
                res,
                "Department created successfully",
                STATUS_CODES.SUCCESS
            );
        } else {
            sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (err) {
        console.log(err);
        sendError(res, "Error in creating department", err.message);
    }
});

departmentRouter.get("/list", authMiddleware, async (req, res) => {
    try {
        if (
            req.user.role == ROLES.SUPER_ADMIN ||
            req.user.role == ROLES.MODERATOR
        ) {
            const departments = await Department.find({});
            sendSuccess(
                res,
                "Departments fetched successfully",
                STATUS_CODES.SUCCESS,
                {
                    departments,
                }
            );
        } else {
            sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (err) {
        console.log(err);
        sendError(res, "Error in fetching departments", err.message);
    }
});

departmentRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        if (
            req.user.role == ROLES.SUPER_ADMIN ||
            req.user.role == ROLES.MODERATOR
        ) {
            const { id } = req.params;
            const department = await Department.findByIdAndDelete(id);
            
            if (!department) {
                return sendError(
                    res,
                    "Department not found",
                    STATUS_CODES.NOT_FOUND
                );
            }

            sendSuccess(
                res,
                "Department deleted successfully",
                STATUS_CODES.SUCCESS
            );
        } else {
            sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (err) {
        console.log(err);
        sendError(res, "Error in deleting department", err.message);
    }
});

departmentRouter.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        if (
            req.user.role == ROLES.SUPER_ADMIN ||
            req.user.role == ROLES.MODERATOR
        ) {
            const { success, data } = departmentUpdateSchema.safeParse(req.body);
            if (!success) {
                return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);
            }

            const { id } = req.params;
            const currentDept = await Department.findById(id);
            
            if (!currentDept) {
                return sendError(
                    res,
                    "Department not found",
                    STATUS_CODES.NOT_FOUND
                );
            }

            const updateData = {
                fullName: data.fullName || currentDept.fullName,
                shortName: data.shortName || currentDept.shortName,
                color: data.color || currentDept.color,
            };

            // Only update semesters if they're empty or if semesterCount is being explicitly set
            if (data.semesterCount) {
                const hasSubjects = currentDept.semesters && Object.values(currentDept.semesters).some(arr => arr && arr.length > 0);
                
                if (!hasSubjects) {
                    // Create empty semesters structure
                    const newSemesters = {};
                    for (let i = 1; i <= data.semesterCount; i++) {
                        newSemesters[i.toString()] = [];
                    }
                    updateData.semesters = newSemesters;
                }
            }
            
            const department = await Department.findByIdAndUpdate(
                id,
                updateData,
                { returnDocument: "after" }
            );

            sendSuccess(
                res,
                "Department updated successfully",
                STATUS_CODES.SUCCESS,
                { department }
            );
        } else {
            sendError(res, "Not authorized", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (err) {
        console.log(err);
        sendError(res, "Error in updating department", err.message);
    }
});

export default departmentRouter;
