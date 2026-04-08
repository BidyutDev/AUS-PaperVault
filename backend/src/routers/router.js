import { Router } from "express";
import fileRouter from "./fileRouter.js";
import adminRouter from "./adminRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use("/files", fileRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);

export default router;
