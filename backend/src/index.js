import express from "express";
import { CORS_ORIGIN, PORT } from "./config.js";
import router from "./routers/router.js";
import cors from "cors";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials : true
    })
);
app.use(cookieParser());

app.use("/api/v1", router);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
