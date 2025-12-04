
import UserModel from "core/models/user.model";
import { CreateUserDto } from "presentation/dto/request/user.dto";

export class UserFactory {
  createUser(dto: CreateUserDto) {
    const userModel = new UserModel();
    if (dto.name) userModel.name = dto.name;
    return userModel;
  }
}

export default UserFactory;
