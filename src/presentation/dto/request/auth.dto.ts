import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAuthDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - user
 *       properties:
 *         email:
 *           type: string
 *           example: john@gmail.com
 *         password:
 *           type: string
 *           example: 12345678
 *         user:
 *           type: string
 *           example: userId
 */
export class CreateAuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  user: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: john@gmail.com
 *         password:
 *           type: string
 *           example: 12345678
 */
export class AuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateAuthDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: newemail@gmail.com
 *         password:
 *           type: string
 *           example: newpassword123
 *         refreshToken:
 *           type: string
 *           example: token123
 */
export class UpdateAuthDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePasswordDto:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: oldpassword123
 *         newPassword:
 *           type: string
 *           example: newpassword123
 */
export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordDto:
 *       type: object
 *       required:
 *         - otp
 *         - email
 *         - newPassword
 *       properties:
 *         otp:
 *           type: number
 *           example: 123456
 *         email:
 *           type: string
 *           example: john@gmail.com
 *         newPassword:
 *           type: string
 *           example: newpassword123
 */
export class ResetPasswordDto {
  @IsNumber()
  otp: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  newPassword: string;
}
