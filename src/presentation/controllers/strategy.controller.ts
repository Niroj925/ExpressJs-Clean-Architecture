
import { ExecuteStrategyUseCase } from "application/use-cases/strategy/execute-strategy-use-case.service";
import { StrategyTokenType } from "common/constant/strategy-key.constant";
import { Request, Response, NextFunction } from "express";
import { CoreApiResponse } from "presentation/api/core-api-response";

export class StrategyController {
  constructor(private readonly executeStrategyUseCase: ExecuteStrategyUseCase) {}

  async getStockStrategyResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { token,symbol } = req.query;

      if (!token) {
        return res
          .status(400)
          .json(CoreApiResponse.error(400, "Token is required"));
      }

      const stock = await this.executeStrategyUseCase.execute(token as StrategyTokenType ,symbol as string);

      return res
        .status(200)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "Strategy based  result fetched successfully"
          )
        );
    } catch (err) {
      return next(err);
    }
  }
}
