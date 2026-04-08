import { Router } from "express";
import { userSchema } from "../types/userSchema.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import User from "../models/user.model.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
    try {
        const { success } = userSchema.safeParse(req.body);
        if (!success) {
            return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);
        }
        const { firstName, lastName, username, email, phoneNumber, password } =
            req.body;

        const user = await User.findOne({
            $or: [{ username }, { email }, { phoneNumber }],
        });

        if (user) {
            return sendError(
                res,
                "User already exists",
                STATUS_CODES.FORBIDDEN
            );
        }

        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            password,
        });

        return sendSuccess(
            res,
            "User succesfully created",
            STATUS_CODES.SUCCESS,
            newUser
        );

    } catch (err) {
        console.log(err)
        return sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err
        );
    }
});

export default userRouter;
