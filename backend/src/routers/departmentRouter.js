import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ROLES } from "../roles.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import Department from "../models/department.model.js";
import { departmentSchema } from "../types/departmentSchema.js";
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
            const { success, data } = departmentSchema.safeParse(req.body);
            if (!success) {
                return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);
            }
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
        sendError(res, "Error in creating department", err.message);
    }
});

export default departmentRouter;
