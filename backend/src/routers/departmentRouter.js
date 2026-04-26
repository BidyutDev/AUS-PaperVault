import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ROLES } from "../roles.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import Department from "../models/department.model.js";
import {
    departmentSchema,
    departmentSemesterSchema,
    departmentSubjectSchema,
    departmentUpdateSchema,
} from "../types/departmentSchema.js";
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

departmentRouter.get("/list", async (req, res) => {
    try {
        let departments;
        const { id } = req.query;
        if (id) {
            departments = await Department.findById(id);
            if (!departments) {
                return sendError(
                    res,
                    "Department with id doesnot exist",
                    STATUS_CODES.NOT_FOUND
                );
            }
        } else {
            departments = await Department.find({});
        }
        sendSuccess(
            res,
            "Departments fetched successfully",
            STATUS_CODES.SUCCESS,
            {
                departments,
            }
        );
    } catch (err) {
        console.log(err);
        sendError(res, "Error in fetching departments", err.message);
    }
});

departmentRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role == ROLES.SUPER_ADMIN) {
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
            const { success, data } = departmentUpdateSchema.safeParse(
                req.body
            );
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
                iconName: data.iconName || currentDept.iconName,
            };

            // Only update semesters if they're empty or if semesterCount is being explicitly set
            if (data.semesterCount) {
                const hasSubjects =
                    currentDept.semesters &&
                    Object.values(currentDept.semesters).some(
                        (arr) => arr && arr.length > 0
                    );

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

departmentRouter.post("/subject/:action", authMiddleware, async (req, res) => {
    const { action } = req.params;
    if (
        ![ROLES.MODERATOR, ROLES.SUPER_ADMIN].includes(req.user.role) ||
        (req.user.role == ROLES.MODERATOR && action == "delete")
    ) {
        return sendError(
            res,
            "Only a super admin or a moderator can add or delete subject",
            STATUS_CODES.UNAUTHORIZED
        );
    }

    if (action != "add" && action != "delete" && action != "edit") {
        return sendError(
            res,
            "Invalid action in the params",
            STATUS_CODES.BAD_REQUEST
        );
    }
    try {
        const { success, data, error } = departmentSubjectSchema.safeParse(
            req.body
        );

        if (!success) {
            return sendError(res, error.message, STATUS_CODES.BAD_REQUEST);
        }

        const dept = await Department.findById(data.deptId);

        if (!dept) {
            return sendError(
                res,
                "No department found with the id",
                STATUS_CODES.NOT_FOUND
            );
        }

        if (action == "delete") {
            const subjectIndex = Object.fromEntries(dept.semesters)[
                data.semester
            ].indexOf(data.subject);
            if (subjectIndex == -1) {
                return sendError(
                    res,
                    `${data.subject} doesnot exist in semester ${data.semester}`
                );
            }
            const ret = Object.fromEntries(dept.semesters)[
                data.semester
            ].splice(subjectIndex, 1);

            await dept.save();
            sendSuccess(
                res,
                "Subject deleted successfully",
                STATUS_CODES.SUCCESS,
                { department: dept }
            );
        } else if (action == "add") {
            Object.fromEntries(dept.semesters)[data.semester].push(
                data.subject
            );

            await dept.save();
            sendSuccess(
                res,
                "Subject added successfully",
                STATUS_CODES.SUCCESS,
                { department: dept }
            );
        } else if (action == "edit") {
            const subjectIndex = Object.fromEntries(dept.semesters)[
                data.semester
            ].indexOf(data.subject);

            if (subjectIndex == -1) {
                return sendError(
                    res,
                    `${data.subject} doesnot exist in semester ${data.semester}`
                );
            }

            Object.fromEntries(dept.semesters)[data.semester][subjectIndex] =
                data.newSubject;

            await dept.save();
            sendSuccess(
                res,
                "Subject edited successfully",
                STATUS_CODES.SUCCESS,
                { department: dept }
            );
        }
    } catch (err) {
        console.log(err);
        sendError(
            res,
            `Error in subject ${action}`,
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

departmentRouter.post("/semester/:action", authMiddleware, async (req, res) => {
    const { action } = req.params;
    if (
        ![ROLES.MODERATOR, ROLES.SUPER_ADMIN].includes(req.user.role) ||
        (req.user.role == ROLES.MODERATOR && action == "delete")
    ) {
        return sendError(
            res,
            "Only a super admin or a moderator can add or delete subject",
            STATUS_CODES.UNAUTHORIZED
        );
    }

    if (action != "add" && action != "delete") {
        return sendError(
            res,
            "Invalid action in the params",
            STATUS_CODES.BAD_REQUEST
        );
    }
    try {
        const { success, data, error } = departmentSemesterSchema.safeParse(
            req.body
        );

        if (!success) {
            return sendError(res, error.message, STATUS_CODES.BAD_REQUEST);
        }

        const dept = await Department.findById(data.deptId);
        if (!dept) {
            return sendError(
                res,
                "No department found with the id",
                STATUS_CODES.NOT_FOUND
            );
        }
        if (action == "add") {
            dept.semesters.set(data.semester, []);
            await dept.save();
            sendSuccess(
                res,
                `Semester ${data.semester} added successfully`,
                STATUS_CODES.SUCCESS
            );
        } else if (action == "delete") {
            const ret = dept.semesters.delete(data.semester);
            if (!ret) {
                return sendError(
                    res,
                    "Semester doesnt exist",
                    STATUS_CODES.NOT_FOUND
                );
            }
            await dept.save();
            sendSuccess(
                res,
                `Semester ${data.semester} deleted successfully`,
                STATUS_CODES.SUCCESS
            );
        }
    } catch (err) {
        console.log(err);
        sendError(res, `Error in semester ${action}`);
    }
});
export default departmentRouter;
