import { Router } from "express";
import { createUserRouter } from "./user.route";

const router = Router();

// Mount the routes
router.use("/user", createUserRouter());

export default router;