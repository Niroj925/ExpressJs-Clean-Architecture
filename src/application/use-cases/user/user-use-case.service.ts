
import { CreateUserDto } from "presentation/dto/request/user.dto";
import UserFactory from "./user-factory-use-case.service";
import AuthFactory from "../auth/auth-factory-use.case.service";
import { IDataServices } from "core/abstracts";

export class UserUseCaseService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly userFactory: UserFactory,
    private readonly authFactory: AuthFactory
  ) {}

  // CREATE USER
  async createUser(dto: CreateUserDto) {
    return await this.dataServices.handleTransaction(async (manager) => {
      const userModel = this.userFactory.createUser(dto);
      const user = await this.dataServices.user.create(userModel, manager);

      const authModel = this.authFactory.createUserAuth({
        ...dto,
        user: user?.id,
      });
      return await this.dataServices.auth.create(authModel, manager);
    });
  }

  // GET SINGLE USER BY ID
  async getUser(id: string) {
    const user = await this.dataServices.user.getOne({ id });

    if (!user) {
      // throw new Error("User not found");
      console.log('user not found')
    }

    return user;
  }

  // GET ALL USERS (Supports Pagination)
  async getUsers(options: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 10 } = options;

    // Prefer a repository-level pagination method when page is provided
    if (
      typeof this.dataServices.user.getAllWithCustomPagination === "function"
    ) {
      // @ts-ignore - some concrete implementations provide this method
      return await this.dataServices.user.getAllWithCustomPagination(
        {},
        {},
        {},
        {},
        page,
        limit
      );
    }

    // Fallback to the simpler getAll which supports `take` (limit)
    return await this.dataServices.user.getAll(
      {}, // condition (empty = all)
      {}, // relations
      {}, // order
      undefined, // select
      limit // pagination size
    );
  }

  // DELETE USER
  async deleteUser(id: string) {
    const user = await this.getUser(id); // will throw if not found
    // return await this.dataServices.user.delete({ id: user.id });
  }
}
