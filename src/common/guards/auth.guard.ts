import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function AuthGuard() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        (req as any).user = payload;

        await originalMethod.apply(this, [req, res, next]);
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    };

    return descriptor;
  };
}
