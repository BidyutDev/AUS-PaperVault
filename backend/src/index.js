import express from "express";
import { CORS_ORIGIN, PORT } from "./config.js";
import router from "./routers/router.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: CORS_ORIGIN,
    })
);

app.use("/api/v1", router);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
