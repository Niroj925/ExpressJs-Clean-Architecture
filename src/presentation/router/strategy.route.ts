import StockFactory from "application/use-cases/stock/stock-factory-use-case.service";
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { ExecuteStrategyUseCase } from "application/use-cases/strategy/execute-strategy-use-case.service";
import { getDataServices } from "common/config/datasource";
import { Router } from "express";
import { ConfigService } from "framework/config/config.service";
import { StrategyRepository } from "framework/repositories/strategy-repository";
import { StrategyController } from "presentation/controllers/strategy.controller";
import asyncHandler from "presentation/middleware/async-handler";

export const createStrategyRouter = () => {
  const router = Router();
  const stockService = new StockUseCaseService(
    getDataServices(),
    new StockFactory(),
    new ConfigService()
  );
  const strategyRepository = new StrategyRepository(stockService);
  const stockStrategy = new ExecuteStrategyUseCase(strategyRepository);

  const controller = new StrategyController(stockStrategy);

  /**
   * @swagger
   * /strategy/stock-result:
   *   get:
   *     summary: Get strategy–based stock result
   *     description: Fetches the result of a stock strategy based on the provided token and symbol.
   *     tags: [Strategy]
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         description: Strategy token used to execute stock strategy
   *         schema:
   *           type: string
   *       - in: query
   *         name: symbol
   *         required: true
   *         description: Stock ticker symbol (e.g., AAPL, TSLA)
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Strategy-based result fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 statusCode:
   *                   type: number
   *                 data:
   *                   type: object
   *                   description: Strategy output result
   *       400:
   *         description: Missing or invalid token
   *       500:
   *         description: Internal server error
   */
  router.get(
    "/stock-result",
    asyncHandler(controller.getStockStrategyResult.bind(controller))
  );

  return router;
};
