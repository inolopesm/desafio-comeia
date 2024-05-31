import argon2 from "argon2";
import * as jose from "jose";
import { AuthRepository } from "./auth.repository";
import { ConfigProvider } from "../../providers/config.provider";
import { SessionDTO } from "./session.dto";
import { SessionSchema } from "./session.schema";

export interface LoginAuthOutputDTO {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshAuthOutputDTO {
  accessToken: string;
}

export const AuthService = {
  async login(
    username: string,
    password: string,
  ): Promise<LoginAuthOutputDTO | Error> {
    const user = await AuthRepository.findUserByUsername(username);

    if (user === null) {
      return new Error("user not found");
    }

    if (!(await argon2.verify(user.password, password))) {
      return new Error("invalid password");
    }

    const textEncoder = new TextEncoder();
    const accessSecret = ConfigProvider.getOrThrow("ACCESS_TOKEN_SECRET");
    const refreshSecret = ConfigProvider.getOrThrow("REFRESH_TOKEN_SECRET");
    const sessionDTO: SessionDTO = { userId: user.id };

    const signJWT = new jose.SignJWT({ ...sessionDTO })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt();

    const accessToken = await signJWT
      .setExpirationTime("5 minutes")
      .sign(textEncoder.encode(accessSecret));

    const refreshToken = await signJWT
      .setExpirationTime("1 day")
      .sign(textEncoder.encode(refreshSecret));

    return { accessToken, refreshToken };
  },

  async refresh(jwt: string): Promise<RefreshAuthOutputDTO | Error> {
    try {
      const textEncoder = new TextEncoder();

      const refreshSecret = ConfigProvider.getOrThrow("REFRESH_TOKEN_SECRET");
      const refreshKey = textEncoder.encode(refreshSecret);

      const { payload } = await jose.jwtVerify(jwt, refreshKey);

      const sessionDTO: SessionDTO = await SessionSchema.parseAsync(payload);
      const accessSecret = ConfigProvider.getOrThrow("ACCESS_TOKEN_SECRET");

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(textEncoder.encode(accessSecret));

      return { accessToken };
    } catch (error) {
      if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
        return error;
      }

      if (error instanceof jose.errors.JWTExpired) {
        return error;
      }

      if (error instanceof jose.errors.JWSInvalid) {
        return error;
      }

      throw error;
    }
  },
};
