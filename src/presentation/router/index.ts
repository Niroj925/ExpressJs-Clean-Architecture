import { Router } from "express";
import { createUserRouter } from "./user.route";
import { createAuthRouter } from "./auth.route";

const router = Router();

// Mount the routes
router.use("/auth", createAuthRouter());
router.use("/user", createUserRouter());

export default router;