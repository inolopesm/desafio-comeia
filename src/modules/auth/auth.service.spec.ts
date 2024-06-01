import { JWTHelper } from "../../helpers/jwt.helper";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./auth.constants";
import { AuthService } from "./auth.service";
import { UserRepository } from "./user.repository";
import type { SessionDTO } from "./session.schema";
import type { UserDTO } from "./user.schema";

const user: UserDTO = {
  id: "id",
  username: "username",
  password: `$argon2id$v=19$m=65536,t=3,p=4$aS/NUo/bLPC38nr/GYEgcg$KLg4k2n1tjIIG9/v9CVO+D6V0Kzu/porQDJVjaLHU4w`,
  createdAt: 0,
  updatedAt: 0,
};

jest.mock("./user.repository", () => ({
  UserRepository: {
    async findByUsername() {
      return user;
    },
  },
}));

jest.mock("./auth.constants", () => ({
  ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
  REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
}));

const sessionDTO: SessionDTO = { userId: user.id };

describe("AuthService", () => {
  describe("login", () => {
    beforeEach(() => {
      jest.useFakeTimers({ now: Date.now() });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return the accessToken and refreshToken when success", async () => {
      const result = await AuthService.login(user.username, "password");

      if (result instanceof Error) {
        console.error(result);
        throw new Error("does not expect result to be an instance of error");
      }

      expect(result.accessToken).toEqual(
        await JWTHelper.encrypt(sessionDTO, ACCESS_TOKEN_SECRET, "5 minutes"),
      );

      expect(result.refreshToken).toEqual(
        await JWTHelper.encrypt(sessionDTO, REFRESH_TOKEN_SECRET, "1 day"),
      );
    });

    it("should return error if the user is not found", async () => {
      jest.spyOn(UserRepository, "findByUsername").mockResolvedValueOnce(null);
      const result = await AuthService.login(user.username, "password");
      expect(result).toEqual(new Error("user not found"));
    });

    it("should return error if the password does not match", async () => {
      const userWithAnotherPassword: UserDTO = {
        id: user.id,
        username: user.username,
        password: `$argon2id$v=19$m=65536,t=3,p=4$5NFLrvUcIWPRLSgM10BmvQ$NUdMYtZv3FEOY+3X8TOimrIXZuZtcjGZ9pa2fr4p7yQ`,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      jest
        .spyOn(UserRepository, "findByUsername")
        .mockResolvedValueOnce(userWithAnotherPassword);

      const result = await AuthService.login(user.username, "password");
      expect(result).toEqual(new Error("invalid password"));
    });
  });

  describe("refresh", () => {
    it("should return the new accessToken when success", async () => {
      const accessToken = await AuthService.refresh({ userId: user.id });

      expect(accessToken).toEqual(
        await JWTHelper.encrypt(sessionDTO, ACCESS_TOKEN_SECRET, "5 minutes"),
      );
    });
  });
});
