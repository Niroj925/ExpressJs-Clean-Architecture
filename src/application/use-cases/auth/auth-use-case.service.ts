import { hashCompare, hashString } from "common/utils/hash";
import AuthFactory from "../auth/auth-factory-use.case.service";
import { IDataServices } from "core/abstracts";
import * as jwt from "jsonwebtoken";
import {
  AuthDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from "presentation/dto/request/auth.dto";
import { ICache } from "common/interface/cache-interface";

export class AuthUseCaseService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly authFactory: AuthFactory,
    private readonly cache: ICache
  ) {}

  async signIn(dto: AuthDto) {
    const { email, password } = dto;
    const auth = await this.dataServices.auth.getOneOrNull(
      { email },
      { user: true }
    );
    if (!auth) throw new Error("User not found");

    const isValid = await hashCompare(password, auth.password);
    if (!isValid) throw new Error("Invalid credentials");

    const accessToken = this.generateAccessToken(auth);
    const refreshToken = this.generateRefreshToken(auth);

    const authModel = this.authFactory.updateUserAuth({ refreshToken });

    await this.dataServices.auth.update({ id: auth.id }, authModel);

    return { message: "Login Successful", accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      );

      const user = await this.dataServices.auth.getOneOrNull({
        id: payload.id,
      });
      if (!user || user.refreshToken !== refreshToken)
        throw new Error("Invalid refresh token");

      const newAccessToken = this.generateAccessToken(user);
      return { accessToken: newAccessToken };
    } catch {
      throw new Error("Refresh token expired or invalid");
    }
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const auth = await this.dataServices.auth.getOneOrNull({ user: { id } });
    if (!auth) throw new Error("User not found");

    const isMatch = await hashCompare(dto.oldPassword, auth.password);
    if (!isMatch) throw new Error("Incorrect current password");

    const authModel = this.authFactory.updateUserAuth({
      password: await hashString(dto.newPassword),
    });

    await this.dataServices.auth.update({ user: { id } }, authModel);
    return { message: "Password updated successfully" };
  }

  async generateOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await this.cache.set(`otp:${email}`, otp, 300);

    return { email, otp };
  }

  async resetPasswordWithOtp(dto: ResetPasswordDto) {
    const { email, otp, newPassword } = dto;

    const cachedOtp = await this.cache.get<number>(`otp:${email}`);
    if (!cachedOtp || cachedOtp !== otp) {
      throw new Error("Invalid or expired OTP");
    }

    const user = await this.dataServices.auth.getOneOrNull({ email });
    if (!user) throw new Error("User not found");

    const hashedPassword = await hashString(newPassword);

    const authModel = this.authFactory.updateUserAuth({
      password: hashedPassword,
    });

    await this.dataServices.auth.update({ id: user.id }, authModel);

    await this.cache.delete(`otp:${email}`);

    return { message: "Password reset successful" };
  }

  private generateAccessToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "1h" }
    );
  }

  private generateRefreshToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );
  }
}
