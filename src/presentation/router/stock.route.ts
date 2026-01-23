import StockFactory from "application/use-cases/stock/stock-factory-use-case.service";
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { getDataServices } from "common/config/datasource";
import { Router } from "express";
import { ConfigService } from "framework/config/config.service";
import { StockController } from "presentation/controllers/stock.controller";
import asyncHandler from "presentation/middleware/async-handler";

export const createStockRouter = () => {
  const router = Router();

  const stockService = new StockUseCaseService(
    getDataServices(),
    new StockFactory(),
    new ConfigService(),
  );

  const controller = new StockController(stockService);

  /**
   * @swagger
   * /stock/insert-listed-stock:
   *   post:
   *     summary: Insert listed stock
   *     tags: [Stock]
   *     responses:
   *       200:
   *         description: Listed stock
   */
  router.post(
    "/insert-listed-stock",
    asyncHandler(controller.createListedStock.bind(controller)),
  );

  /**
   * @swagger
   * /stock/listed-stock-info:
   *   get:
   *     summary: get all listed stock info
   *     tags: [Stock]
   *     responses:
   *       200:
   *         description: get all the Listed stock info
   */
  router.get(
    "/listed-stock-info",
    asyncHandler(controller.getAllStockInfo.bind(controller)),
  );

  /**
   * @swagger
   * /stock/listed-stock-price:
   *   get:
   *     summary: Get all listed stock prices
   *     tags: [Stock]
   *     responses:
   *       200:
   *         description: Get all the listed stock prices
   */
  router.get(
    "/listed-stock-price",
    asyncHandler(controller.getAllStockPrice.bind(controller)),
  );

  /**
   * @swagger
   * /stock/listed-stock-price/paginated:
   *   get:
   *     summary: Get stock prices with pagination
   *     tags: [Stock]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of records per page
   *     responses:
   *       200:
   *         description: Paginated stock prices fetched successfully
   */
  router.get(
    "/listed-stock-price/paginated",
    asyncHandler(controller.getStockPriceWithPagination.bind(controller)),
  );

  /**
   * @swagger
   * /stock/listed-stock-price/date:
   *   get:
   *     summary: Get stock prices by date
   *     tags: [Stock]
   *     parameters:
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *         description: Date in YYYY-MM-DD format
   *     responses:
   *       200:
   *         description: Stock prices fetched for the given date
   */
  router.get(
    "/listed-stock-price/date",
    asyncHandler(controller.getStockByDate.bind(controller)),
  );

  /**
   * @swagger
   * /stock/listed-stock-price/symbol:
   *   get:
   *     summary: Get stock prices by symbol
   *     tags: [Stock]
   *     parameters:
   *       - in: query
   *         name: symbol
   *         required: true
   *         schema:
   *           type: string
   *         description: Stock symbol (e.g., ACLBSLP)
   *     responses:
   *       200:
   *         description: Stock prices fetched for the given symbol
   */
  router.get(
    "/listed-stock-price/symbol",
    asyncHandler(controller.getStockBySymbol.bind(controller)),
  );

  /**
   * @swagger
   * /stock/listed-stock-price/symbol/days:
   *   get:
   *     summary: Get latest N days stock price by symbol
   *     tags: [Stock]
   *     parameters:
   *       - in: query
   *         name: symbol
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: days
   *         schema:
   *           type: integer
   *           default: 7
   *     responses:
   *       200:
   *         description: Latest N days of stock prices
   */
  router.get(
    "/listed-stock-price/symbol/days",
    asyncHandler(controller.getStockPriceDays.bind(controller)),
  );

  /**
   * @swagger
   * /stock/insert-stock-price:
   *   post:
   *     summary: insert stock price history
   *     tags: [Stock]
   *     responses:
   *       200:
   *         description:  all stock price insserted
   */
  router.post(
    "/insert-stock-price",
    asyncHandler(controller.insertStockPrice.bind(controller)),
  );

  /**
   * @swagger
   * /stock/insert-stock-price-after-date:
   *   post:
   *     summary: insert stock price after date
   *     tags: [Stock]
   *     parameters:
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description:  all stock price after date inserted
   */
  router.post(
    "/insert-stock-price-after-date",
    asyncHandler(controller.insertStockAfterDate.bind(controller)),
  );

  /**
   * @swagger
   * /stock/delete-before-date:
   *   delete:
   *     summary: Delete all stock prices older than a given date
   *     tags: [Stock]
   *     responses:
   *       200:
   *         description: Old stock records deleted successfully
   */
  router.delete(
    "/delete-before-date",
    asyncHandler(controller.deleteOldStockPrice.bind(controller)),
  );

  /**
   * @swagger
   * /stock/indicator-based-calculation:
   *   post:
   *     summary: Calculate technical indicator based calculation
   *     tags: [Stock]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IndicatorRequestDto'
   *     responses:
   *       200:
   *         description: Indicator result fetched successfully
   */

  router.post(
    "/indicator-based-calculation",
    asyncHandler(controller.getIndicatorBasedResult.bind(controller)),
  );

  return router;
};
