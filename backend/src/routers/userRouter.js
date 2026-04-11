import { Router } from "express";
import { loginSchema, signUpSchema } from "../types/userSchema.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import User from "../models/user.model.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/generateToken.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/request-token", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return sendError(
                res,
                "No refresh token provided",
                STATUS_CODES.FORBIDDEN
            );
        }
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return sendError(
                res,
                "Invalid refresh token",
                STATUS_CODES.FORBIDDEN
            );
        }

        if (user.refreshTokenExpiry && user.refreshTokenExpiry < Date.now()) {
            user.refreshToken = null;
            user.refreshTokenExpiry = null;
            await user.save();
            return sendError(
                res,
                "Refresh token expired. Please login again.",
                STATUS_CODES.FORBIDDEN
            );
        }

        const newAccessToken = generateAccessToken({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        sendSuccess(res, "New access token generated", STATUS_CODES.SUCCESS, {
            username: user.username,
            email: user.email,
            role: user.role,
            token: newAccessToken,
        });
    } catch (err) {
        console.log(err);
        sendError(
            res,
            "Error in generating refresh token",
            STATUS_CODES.SERVER_ERROR,
            err
        );
    }
});

userRouter.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: res.user._id });

        if (!user) {
            return sendError(res, "User not found", STATUS_CODES.NOT_FOUND);
        }

        sendSuccess(res, "User fetched succesfully", STATUS_CODES.SUCCESS, {
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

userRouter.post("/register", async (req, res) => {
    try {
        const { success } = signUpSchema.safeParse(req.body);
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
        const refreshToken = generateRefreshToken({
            username,
            email,
        });

        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            password,
            refreshToken,
        });

        const token = generateAccessToken({
            _id: newUser._id,
            username,
            email,
            role: newUser.role,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return sendSuccess(
            res,
            "User succesfully created",
            STATUS_CODES.SUCCESS,
            { token, username, email, role: newUser.role, userId: newUser._id }
        );
    } catch (err) {
        console.log(err);
        return sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err
        );
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { success } = loginSchema.safeParse(req.body);

        if (!success) {
            return sendError(res, "Invalid body", STATUS_CODES.BAD_REQUEST);
        }
        const { identifier, password } = req.body;

        const query = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
            ? { email: identifier }
            : { username: identifier };

        const user = await User.findOne(query);

        if (!user) {
            return sendError(res, "User not found", STATUS_CODES.NOT_FOUND);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return sendError(res, "Invalid password", STATUS_CODES.FORBIDDEN);
        }

        user.refreshToken = generateRefreshToken({
            username: user.username,
            email: user.email,
        });

        res.cookie("refreshToken", user.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        await user.save();

        const token = generateAccessToken({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        sendSuccess(res, "Logged in successfully", STATUS_CODES.SUCCESS, {
            token,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.log(err);
        return sendError(
            res,
            "Error in server",
            STATUS_CODES.SERVER_ERROR,
            err
        );
    }
});

userRouter.post("/delete", async (req, res) => {
    
});

export default userRouter;
