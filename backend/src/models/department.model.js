import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Fullname is required"],
    },
    shortName: {
        type: String,
        required: [true, "Shortname is required"],
    },
    semesters: {
        type: Number,
        required: [true, "Number of semesters is required"],
    },
    color: {
        type: String,
        default: "#000",
    },
    years: {
        type: Number,
        required: [true, "Number of years is required"],
    },
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
