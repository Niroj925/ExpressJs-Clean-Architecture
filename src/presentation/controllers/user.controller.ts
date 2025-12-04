import { Request, Response, NextFunction } from 'express';
import { UserUseCaseService } from 'application/use-cases/user/user-use-case.service';
import { CoreApiResponse } from 'presentation/api/core-api-response';
import { CreateUserDto } from 'presentation/dto/request/user.dto';

export class UserController {
  constructor(private readonly userService: UserUseCaseService) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateUserDto;
      const user = await this.userService.createUser(dto);
      return res.status(201).json(CoreApiResponse.success(user, 201, 'User created successfully'));
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.userService.getUsers({ page, limit });
      return res.status(200).json(CoreApiResponse.pagination(result, { page, limit }, 200, 'Users fetched successfully'));
    } catch (err) {
      return next(err);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUser(req.params.id);
      return res.json(CoreApiResponse.success(user, 200, 'User fetched successfully'));
    } catch (err) {
      return next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.deleteUser(req.params.id);
      return res.json(CoreApiResponse.success({}, 200, 'User deleted successfully'));
    } catch (err) {
      return next(err);
    }
  }
}

export default UserController;
