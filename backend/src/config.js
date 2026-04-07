import { config } from "dotenv";

config({
    path: ".env",
});

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

export { PORT, CORS_ORIGIN };
