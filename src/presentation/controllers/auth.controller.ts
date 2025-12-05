import { Request, Response, NextFunction } from "express";
import { AuthUseCaseService } from "application/use-cases/auth/auth-use-case.service";
import { CoreApiResponse } from "presentation/api/core-api-response";
import {
  AuthDto,
  UpdatePasswordDto,
  ResetPasswordDto,
} from "presentation/dto/request/auth.dto";

export class AuthController {
  constructor(private readonly authService: AuthUseCaseService) {}

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as AuthDto;
      const result = await this.authService.signIn(dto);
      return res.status(200).json(CoreApiResponse.success(result, 200, "Login successful"));
    } catch (err) {
      return next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      return res.status(200).json(CoreApiResponse.success(result, 200, "Token refreshed successfully"));
    } catch (err) {
      return next(err);
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id; // or from JWT payload
      const dto = req.body as UpdatePasswordDto;
      const result = await this.authService.updatePassword(userId, dto);
      return res.status(200).json(CoreApiResponse.success(result, 200, "Password updated successfully"));
    } catch (err) {
      return next(err);
    }
  }

  async generateOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.authService.generateOtp(email);
      return res.status(200).json(CoreApiResponse.success(result, 200, "OTP generated successfully"));
    } catch (err) {
      return next(err);
    }
  }

  async resetPasswordWithOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ResetPasswordDto;
      const result = await this.authService.resetPasswordWithOtp(dto);
      return res.status(200).json(CoreApiResponse.success(result, 200, "Password reset successfully"));
    } catch (err) {
      return next(err);
    }
  }
}

export default AuthController;
