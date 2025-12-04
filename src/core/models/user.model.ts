import { BaseModel } from "./base";

export class UserModel extends BaseModel {
  name: string;
  isActive: boolean;
}

export default UserModel;
