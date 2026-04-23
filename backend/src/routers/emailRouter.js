import { Router } from "express";
import User from "../models/user.model.js";
import EmailVerification from "../models/emailVerification.model.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../services/email.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import { generateOTP } from "../utils/generateOtp.js";

const emailRouter = Router();

emailRouter.post("/send-verification", async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return sendError(
                res,
                "Username and email are required",
                STATUS_CODES.BAD_REQUEST
            );
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
            return sendError(
                res,
                "An account with this username or email already exists",
                STATUS_CODES.BAD_REQUEST
            );
        }

        await EmailVerification.deleteMany({ email });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await EmailVerification.create({
            username,
            email,
            otp,
            otpExpiry,
        });
        await sendVerificationEmail(email, otp);
        return sendSuccess(
            res,
            "OTP sent successfully to your email",
            STATUS_CODES.SUCCESS,
            { email, message: "Check your email for OTP" }
        );
    } catch (error) {
        console.error("Error in send-verification:", error);
        return sendError(
            res,
            "Error sending verification email",
            STATUS_CODES.SERVER_ERROR,
            error.message
        );
    }
});

emailRouter.post("/verify-otp", async (req, res) => {
    try {
        const { username, email, otp } = req.body;

        if (!username || !email || !otp) {
            return sendError(
                res,
                "Username , email and OTP are required",
                STATUS_CODES.BAD_REQUEST
            );
        }

        const verification = await EmailVerification.findOne({ email });

        if (!verification) {
            return sendError(
                res,
                "No OTP request found for this user",
                STATUS_CODES.NOT_FOUND
            );
        }

        if (verification.otpExpiry < new Date()) {
            await EmailVerification.deleteOne({ email });
            return sendError(
                res,
                "OTP has expired. Please request a new OTP.",
                STATUS_CODES.FORBIDDEN
            );
        }

        if (verification.otp !== otp) {
            verification.attempts += 1;
            await verification.save();

            const remainingAttempts =
                verification.maxAttempts - verification.attempts;
            if (remainingAttempts <= 0) {
                await EmailVerification.deleteOne({ email });
                return sendError(
                    res,
                    "Too many incorrect OTP attempts. Please request a new OTP.",
                    STATUS_CODES.FORBIDDEN,
                    { attemptsLeft: 0 }
                );
            }

            return sendError(
                res,
                `Invalid OTP. ${remainingAttempts} attempts remaining.`,
                STATUS_CODES.FORBIDDEN,
                { attemptsLeft: remainingAttempts }
            );
        }
        verification.isVerified = true;
        verification.verifiedAt = new Date();
        verification.attempts = 0;
        await verification.save();

        await sendWelcomeEmail(email, username);

        return sendSuccess(
            res,
            "Email verified successfully! Welcome to AUS PaperVault.",
            STATUS_CODES.SUCCESS,
            {
                verified: true,
                email: email,
                username: username,
            }
        );
    } catch (error) {
        console.error("Error in verify-otp:", error);
        return sendError(
            res,
            "Error verifying OTP",
            STATUS_CODES.SERVER_ERROR,
            error.message
        );
    }
});

emailRouter.post("/resend-otp", async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return sendError(
                res,
                "Username and email are required",
                STATUS_CODES.BAD_REQUEST
            );
        }

        await EmailVerification.deleteMany({ email });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await EmailVerification.create({
            username,
            email,
            otp,
            otpExpiry,
        });

        await sendVerificationEmail(email, otp);

        return sendSuccess(
            res,
            "OTP resent successfully",
            STATUS_CODES.SUCCESS,
            { email, message: "Check your email for the new OTP" }
        );
    } catch (error) {
        console.error("Error in resend-otp:", error);
        return sendError(
            res,
            "Error resending OTP",
            STATUS_CODES.SERVER_ERROR,
            error.message
        );
    }
});

emailRouter.get("/check-verification/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return sendError(res, "User not found", STATUS_CODES.NOT_FOUND);
        }

        return sendSuccess(
            res,
            "Verification status retrieved",
            STATUS_CODES.SUCCESS,
            {
                email: user.email,
                verified: user.isVerified,
                userId: user._id,
            }
        );
    } catch (error) {
        console.error("Error in check-verification:", error);
        return sendError(
            res,
            "Error checking verification status",
            STATUS_CODES.SERVER_ERROR,
            error.message
        );
    }
});

emailRouter.post("/reset-password-send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendError(
                res,
                "Email is required",
                STATUS_CODES.BAD_REQUEST
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return sendError(
                res,
                "No user exists with this email",
                STATUS_CODES.NOT_FOUND
            );
        }

        await EmailVerification.deleteMany({ email });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await EmailVerification.create({
            username: user.username,
            email,
            otp,
            otpExpiry,
        });

        await sendVerificationEmail(
            email,
            otp,
            "Reset your password using the OTP below:"
        );

        return sendSuccess(
            res,
            "OTP sent successfully to your email",
            STATUS_CODES.SUCCESS,
            { email, message: "Check your email for OTP" }
        );
    } catch (err) {
        console.log(err);
        sendError(
            res,
            "Error in sending otp",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

emailRouter.post("/reset-password-resend-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendError(
                res,
                "Email is required",
                STATUS_CODES.BAD_REQUEST
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return sendError(
                res,
                "No user exists with this email",
                STATUS_CODES.NOT_FOUND
            );
        }

        await EmailVerification.deleteMany({ email });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await EmailVerification.create({
            username: user.username,
            email,
            otp,
            otpExpiry,
        });

        await sendVerificationEmail(
            email,
            otp,
            "Reset your password using the OTP below:"
        );

        return sendSuccess(
            res,
            "OTP resent successfully",
            STATUS_CODES.SUCCESS,
            { email, message: "Check your email for the new OTP" }
        );
    } catch (err) {
        console.log(err);
        sendError(
            res,
            "Error in resending otp",
            STATUS_CODES.SERVER_ERROR,
            err.message
        );
    }
});

emailRouter.post("/reset-password-verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return sendError(
                res,
                "Email and OTP are required",
                STATUS_CODES.BAD_REQUEST
            );
        }

        const verification = await EmailVerification.findOne({ email });

        if (!verification) {
            return sendError(
                res,
                "No OTP request found for this user",
                STATUS_CODES.NOT_FOUND
            );
        }

        if (verification.otpExpiry < new Date()) {
            await EmailVerification.deleteOne({ email });
            return sendError(
                res,
                "OTP has expired. Please request a new OTP.",
                STATUS_CODES.FORBIDDEN
            );
        }

        if (verification.otp !== otp) {
            verification.attempts += 1;
            await verification.save();

            const remainingAttempts =
                verification.maxAttempts - verification.attempts;
            if (remainingAttempts <= 0) {
                await EmailVerification.deleteOne({ email });
                return sendError(
                    res,
                    "Too many incorrect OTP attempts. Please request a new OTP.",
                    STATUS_CODES.FORBIDDEN,
                    { attemptsLeft: 0 }
                );
            }

            return sendError(
                res,
                `Invalid OTP. ${remainingAttempts} attempts remaining.`,
                STATUS_CODES.FORBIDDEN,
                { attemptsLeft: remainingAttempts }
            );
        }
        verification.isVerified = true;
        verification.verifiedAt = new Date();
        verification.attempts = 0;
        await verification.save();

        return sendSuccess(
            res,
            "Email is verified successfully",
            STATUS_CODES.SUCCESS,
            {
                verified: true,
                email: email,
            }
        );
    } catch (error) {
        console.error("Error in verify-otp:", error);
        return sendError(
            res,
            "Error verifying OTP",
            STATUS_CODES.SERVER_ERROR,
            error.message
        );
    }
});

export default emailRouter;
