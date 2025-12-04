import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';

export function validateDto(DtoClass: new () => any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = Object.assign(new DtoClass(), req.body);
    const errors = await validate(dto as object, { skipMissingProperties: false });
    if (errors.length > 0) {
      // Format errors minimally
      const formatted = errors.map((e) => ({ property: e.property, constraints: e.constraints }));
      return res.status(400).json({ statusCode: 400, message: 'Validation failed', errors: formatted });
    }
    req.body = dto;
    return next();
  };
}

export default validateDto;
