import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLES } from "../roles.js";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            minlength: 2,
            maxlength: 50,
            trim: true,
        },
        lastName: {
            type: String,
            minlength: 2,
            maxlength: 50,
            trim: true,
        },
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        refreshToken: {
            type: String,
        },
        refreshTokenExpiry: {
            type: Number,
        },
        role: {
            type: String,
            enum: [
                ROLES.SUPER_ADMIN,
                ROLES.MODERATOR,
                ROLES.REVIEWER,
                ROLES.MEMBER,
            ],
            default: ROLES.MEMBER,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        console.log(err);
    }
});

userSchema.pre("save", async function () {
    if (this.isModified("refreshTokenExpiry")) return;
    this.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
