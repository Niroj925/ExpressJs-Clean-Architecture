import { AuthModel } from "core/models/auth.model";
import UserModel from "core/models/user.model";
import { CreateAuthDto } from "presentation/dto/request/user.dto";

export class AuthFactory {
  createUserAuth(dto: CreateAuthDto) {
    const authModel = new AuthModel();
    if (dto.email) authModel.email = dto.email;
    if (dto.password)  authModel.password = dto.password;
    if (dto.user) {
    const userModel=new UserModel();
      userModel.id=dto.user;
      authModel.user=userModel;
    } 
    return authModel;
  }
}

export default AuthFactory;
