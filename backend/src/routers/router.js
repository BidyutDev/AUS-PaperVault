import { Router } from "express";
import fileRouter from "./fileRouter.js";
import staffRouter from "./staffRouter.js";
import userRouter from "./userRouter.js";
import healthRouter from "./healthRouter.js";
import feedbackRouter from "./feedbackRouter.js";
import emailRouter from "./emailRouter.js";
import departmentRouter from "./departmentRouter.js";

const router = Router();

router.use("/files", fileRouter);
router.use("/staff", staffRouter);
router.use("/user", userRouter);
router.use("/health", healthRouter);
router.use("/feedback", feedbackRouter);
router.use("/email", emailRouter);
router.use("/department", departmentRouter);

export default router;
