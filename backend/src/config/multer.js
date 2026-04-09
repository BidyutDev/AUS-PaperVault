import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { department, semester, subject, year } = req.body;
        const uploadDir = path.join(
            __dirname,
            `../../uploads/${department}/${semester}/${subject}/${year}`
        );

        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const { department, semester, subject, year } = req.body;
        const ext = path.extname(file.originalname);
        const filename = `${department}_${semester}_${subject}_${year}${ext}`;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ["application/pdf"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF is allowed."), false);
    }
};

const multerUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024, // 30MB
    },
});

export default multerUpload;
