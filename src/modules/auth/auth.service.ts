import argon2 from "argon2";
import { JWTHelper } from "../../helpers/jwt.helper";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./auth.constants";
import { UserRepository } from "./user.repository";
import type { SessionDTO } from "./session.schema";

export const AuthService = {
  async login(username: string, password: string) {
    const user = await UserRepository.findByUsername(username);

    if (user === null) {
      return new Error("user not found");
    }

    if (!(await argon2.verify(user.password, password))) {
      return new Error("invalid password");
    }

    const accessToken = await JWTHelper.encrypt(
      { userId: user.id } satisfies SessionDTO,
      ACCESS_TOKEN_SECRET,
      "5 minutes",
    );

    const refreshToken = await JWTHelper.encrypt(
      { userId: user.id } satisfies SessionDTO,
      REFRESH_TOKEN_SECRET,
      "1 day",
    );
    return { accessToken, refreshToken };
  },

  async refresh(sessionDTO: SessionDTO) {
    const accessToken = await JWTHelper.encrypt(
      { ...sessionDTO },
      ACCESS_TOKEN_SECRET,
      "5 minutes",
    );

    return accessToken;
  },
};
