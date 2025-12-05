import { Router } from "express";
import AuthController from "presentation/controllers/auth.controller";
import { asyncHandler } from "presentation/middleware/async-handler";
import { validateDto } from "presentation/middleware/validate-dto";
import { AuthDto, ResetPasswordDto, UpdatePasswordDto } from "presentation/dto/request/auth.dto";
import { getDataServices } from "common/config/datasource";
import AuthFactory from "application/use-cases/auth/auth-factory-use.case.service";
import { AuthUseCaseService } from "application/use-cases/auth/auth-use-case.service";
import { RedisCache } from "framework/cache/redis-cache";

export const createAuthRouter = () => {
  const router = Router();

  // Instantiate services
  const cache = new RedisCache();
  const authService = new AuthUseCaseService(getDataServices(), new AuthFactory(), cache);
  const controller = new AuthController(authService);

  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: User Sign In
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthDto'
   *     responses:
   *       200:
   *         description: Login successful
   */
  router.post('/signin', validateDto(AuthDto), asyncHandler(controller.signIn.bind(controller)));

  /**
   * @swagger
   * /auth/refresh-token:
   *   post:
   *     summary: Refresh Access Token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 example: token123
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   */
  router.post('/refresh-token', asyncHandler(controller.refreshToken.bind(controller)));

  /**
   * @swagger
   * /auth/update-password/{id}:
   *   post:
   *     summary: Update password
   *     tags: [Auth]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           example: 37c928bd-5f6c-4c87-9c11-1a1fbcf51f3d
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdatePasswordDto'
   *     responses:
   *       200:
   *         description: Password updated successfully
   */
  router.post(
    '/update-password/:id',
    validateDto(UpdatePasswordDto),
    asyncHandler(controller.updatePassword.bind(controller))
  );

  /**
   * @swagger
   * /auth/generate-otp:
   *   post:
   *     summary: Generate OTP for password reset
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 example: john@gmail.com
   *     responses:
   *       200:
   *         description: OTP generated successfully
   */
  router.post(
    '/generate-otp',
    asyncHandler(controller.generateOtp.bind(controller))
  );

  /**
   * @swagger
   * /auth/reset-password-otp:
   *   post:
   *     summary: Reset password using OTP
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPasswordDto'
   *     responses:
   *       200:
   *         description: Password reset successfully
   */
  router.post(
    '/reset-password-otp',
    validateDto(ResetPasswordDto),
    asyncHandler(controller.resetPasswordWithOtp.bind(controller))
  );

  return router;
};
