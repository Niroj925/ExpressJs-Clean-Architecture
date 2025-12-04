import { IsEmail, IsString } from "class-validator";

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
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@gmail.com
 *         password:
 *           type: string
 *           example: 12345678
 */
export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export interface UserDto {
  id?: number | string;
  name: string;
  email?: string;
  createdAt?: Date;
}
