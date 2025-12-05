import { CreateUserDto } from "presentation/dto/request/user.dto";
import UserFactory from "./user-factory-use-case.service";
import AuthFactory from "../auth/auth-factory-use.case.service";
import { IDataServices } from "core/abstracts";
import { hashString } from "common/utils/hash";
import AppException from "common/exception/app.exception";
export class UserUseCaseService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly userFactory: UserFactory,
    private readonly authFactory: AuthFactory
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.dataServices.handleTransaction(async (manager) => {
      const userModel = this.userFactory.createUser(dto);
      const user = await this.dataServices.user.create(userModel, manager);

      const authModel = this.authFactory.createUserAuth({
        ...dto,
        password: await hashString(dto.password),
        user: user?.id,
      });
      return await this.dataServices.auth.create(authModel, manager);
    });
  }

  async getUser(id: string) {
    const user = await this.dataServices.user.getOne({ id });

    if (!user) {
      console.log("user not found");
      throw new AppException({ message: "Not Found" }, "user not found", 403);
    }

    return user;
  }

  async getUsers(options: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 10 } = options;
    if (
      typeof this.dataServices.user.getAllWithCustomPagination === "function"
    ) {
      return await this.dataServices.user.getAllWithCustomPagination(
        {},
        {},
        {},
        {},
        page,
        limit
      );
    }

    return await this.dataServices.user.getAll({}, {}, {}, undefined, limit);
  }

  async deleteUser(id: string) {
    await this.dataServices.user.delete({ id });
    return true;
  }
}
