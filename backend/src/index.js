import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { CORS_ORIGIN, PORT } from "./config.js";
import router from "./routers/router.js";
import cors from "cors";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import getNgrokUrl from "./utils/getNgrokUrl.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: CORS_ORIGIN,
        credentials: true,
    },
});

export { io };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
    })
);
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use("/api/v1", router);

connectDB();

httpServer.listen(PORT, async () => {
    const ngrok_uri = await getNgrokUrl();
    console.log(`Server running on ${ngrok_uri ? `${ngrok_uri} and ` : ""}http://localhost:${PORT}`);
});
