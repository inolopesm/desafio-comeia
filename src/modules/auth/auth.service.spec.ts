import argon2 from "argon2";
import * as jose from "jose";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { SessionDTO } from "./session.dto";
import { AuthRepository } from "./auth.repository";

jest.mock("../../providers/mongo.provider", () => ({
  MongoProvider: {
    getClient: () => ({
      db: () => ({
        collection: () => ({
          findOne: async (): Promise<User> => ({
            id: "id",
            username: "username",
            password: await argon2.hash("password"),
            createdAt: 0,
            updatedAt: 0,
          }),
        }),
      }),
    }),
  },
}));

jest.mock("../../providers/config.provider", () => ({
  ConfigProvider: {
    getOrThrow: (key: string) =>
      ({
        ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
        REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
      })[key],
  },
}));

describe("AuthService", () => {
  describe("login", () => {
    beforeEach(() => {
      jest.useFakeTimers({ now: Date.now() });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return the accessToken and refreshToken when success", async () => {
      const output = await AuthService.login("username", "password");

      if (output instanceof Error)
        throw new Error("unexpected output to be an instance of error");

      const sessionDTO: SessionDTO = { userId: "id" };

      expect(output.accessToken).toEqual(
        await new jose.SignJWT({ ...sessionDTO })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("5 minutes")
          .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET")),
      );

      expect(output.refreshToken).toEqual(
        await new jose.SignJWT({ ...sessionDTO })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("1 day")
          .sign(new TextEncoder().encode("REFRESH_TOKEN_SECRET")),
      );
    });

    it("should return error if the user is not found", async () => {
      jest
        .spyOn(AuthRepository, "findUserByUsername")
        .mockResolvedValueOnce(null);

      const output = await AuthService.login("username", "password");
      expect(output).toEqual(new Error("user not found"));
    });

    it("should return error if the password does not match", async () => {
      jest.spyOn(AuthRepository, "findUserByUsername").mockResolvedValueOnce({
        id: "id",
        username: "username",
        password: await argon2.hash("another-password"),
        createdAt: 0,
        updatedAt: 0,
      });

      const output = await AuthService.login("username", "password");
      expect(output).toEqual(new Error("invalid password"));
    });
  });
});
