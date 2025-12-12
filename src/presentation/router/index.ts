import { Router } from "express";
import { createUserRouter } from "./user.route";
import { createAuthRouter } from "./auth.route";
import { createStockRouter } from "./stock.route";
import { createStrategyRouter } from "./strategy.route";

const router = Router();

// Mount the routes
router.use("/auth", createAuthRouter());
router.use("/user", createUserRouter());
router.use("/stock", createStockRouter());
router.use("/strategy", createStrategyRouter());

export default router;