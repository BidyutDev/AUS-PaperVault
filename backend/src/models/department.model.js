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
        type: Map,
        of: [String],
    },
    color: {
        type: String,
        default: "#000",
    },
    iconName: {
        type: String,
        default: "Monitor",
        enum: ["Monitor", "Cpu", "Zap", "Cog", "Building2", "Atom", "FlaskConical", "Calculator", "BookOpen", "Languages", "Landmark", "TrendingUp", "Briefcase", "Leaf", "Microscope"],
    },
    years: {
        type: [Number],
        required: [true, "Number of years is required"],
    },
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
