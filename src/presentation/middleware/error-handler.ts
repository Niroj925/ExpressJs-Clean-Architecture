import { BaseException } from 'common/exception/base.exception';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof BaseException) {
    return res.status(err.statusCode).json(err.response);
  }

  // fallback for unknown errors
  return res.status(500).json({
    statusCode: 500,
    timestamp: new Date().toISOString(),
    message: err.message || 'Internal Server Error',
    error: {},
    data: {},
  });
};
