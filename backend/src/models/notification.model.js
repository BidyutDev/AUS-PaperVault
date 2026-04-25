import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
        link: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: ["info", "alert", "announcement", "maintenance"],
            default: "info",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 7 * 24 * 60 * 60 }
);
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
