import { UserUseCaseService } from "application/use-cases/user/user-use-case.service";
import { Router } from "express";
import UserController from "presentation/controllers/user.controller";
import { asyncHandler } from "presentation/middleware/async-handler";
import { validateDto } from "presentation/middleware/validate-dto";
import { CreateUserDto } from "presentation/dto/request/user.dto";
import { getDataServices } from "common/config/datasource";
import UserFactory from "application/use-cases/user/user-factory-use-case.service";
import AuthFactory from "application/use-cases/auth/auth-factory-use.case.service";

export const createUserRouter = () => {
  const router = Router();

  const userService = new UserUseCaseService(getDataServices(), new UserFactory(),new AuthFactory());

  const controller = new UserController(userService);

  /**
   * @swagger
   * /user:
   *   post:
   *     summary: Create User
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: User created successfully
   */
  router.post('/', validateDto(CreateUserDto), asyncHandler(controller.createUser.bind(controller)));

  /**
   * @swagger
   * /user:
   *   get:
   *     summary: Get all users
   *     tags: [User]
   *     responses:
   *       200:
   *         description: List of users
   */
  router.get('/', asyncHandler(controller.getUsers.bind(controller)));

  /**
   * @swagger
   * /user/{id}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           example: 37c928bd-5f6c-4c87-9c11-1a1fbcf51f3d
   *         description: User ID
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *       404:
   *         description: User not found
   */
  router.get('/:id', asyncHandler(controller.getUser.bind(controller)));

  /**
   * @swagger
   * /user/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           example: 37c928bd-5f6c-4c87-9c11-1a1fbcf51f3d
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   */
  router.delete('/:id', asyncHandler(controller.deleteUser.bind(controller)));

  return router;
};
