import { Router } from "express";
import fileRouter from "./fileRouter.js";
import adminRouter from "./adminRouter.js";

const router = Router();

router.use("/files", fileRouter);
router.use("/admin", adminRouter);

export default router;
