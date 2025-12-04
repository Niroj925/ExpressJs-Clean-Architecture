import BaseModel from "./base";
import UserModel from "./user.model";

export class AuthModel extends BaseModel {
  email?: string;
  password?: string;
  user?:UserModel;
}
