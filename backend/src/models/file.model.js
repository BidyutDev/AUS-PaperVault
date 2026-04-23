import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: [true, "File name is required"],
        },
        fileSize: {
            type: Number,
            required: [true, "File size is required"],
        },
        mimeType: {
            type: String,
            default: "application/pdf"
        },
        path: {
            type: String,
            required: [true, "File path is required"],
        },
        department: {
            type: String,
            required: [true, "Department is required"],
            index: true,
        },
        semester: {
            type: String,
            required: [true, "Semester is required"],
            index: true,
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            index: true,
        },
        year: {
            type: String,
            required: [true, "Year is required"],
            index: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
        isApproved: {
            type: Boolean,
            default: false,
            index: true,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        approvedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const File = mongoose.model("File", fileSchema);

export default File;
