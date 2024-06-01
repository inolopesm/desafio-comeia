import * as jose from "jose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../src/app";
import { MongoProvider } from "../src/providers/mongo.provider";
import type { SessionDTO } from "../src/modules/auth/session.schema";
import type { UserDTO } from "../src/modules/auth/user.schema";

jest.mock("../src/modules/auth/auth.constants", () => ({
  ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
  REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
}));

const userDTO: UserDTO = {
  id: "2797835f-76a4-46b6-8572-10027ab06ed8",
  username: "matheus",
  password: `$argon2id$v=19$m=65536,t=3,p=4$SzGuC08WqCVW3sWK7F6APQ$Dg184GXflcE+V+7Dmfx75scJt7njwuqFmW0xrviVSCo`,
  createdAt: 1717269758198,
  updatedAt: 1717269758198,
};

describe("/api/v1/auth", () => {
  let mongoMemoryServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    await MongoProvider.connect(mongoMemoryServer.getUri("comeia"));
  });

  afterAll(async () => {
    await MongoProvider.disconnect();
    await mongoMemoryServer.stop();
  });

  beforeEach(async () => {
    await MongoProvider.getClient().db().collection("users").deleteMany();
  });

  describe("/api/v1/auth/login", () => {
    it("should return 200 when success", async () => {
      await MongoProvider.getClient()
        .db()
        .collection("users")
        .insertOne(userDTO);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ username: "matheus", password: "12345678" });

      expect(response.status).toEqual(200);
      expect(typeof response.body.accessToken).toBe("string");
      expect(typeof response.body.refreshToken).toBe("string");
    });

    it("should return 400 if user has not found", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ username: "matheus", password: "12345678" });

      expect(response.status).toEqual(400);
      expect(response.body.message).toBe("user not found");
    });

    it("should return 400 if password is invalid", async () => {
      await MongoProvider.getClient()
        .db()
        .collection("users")
        .insertOne(userDTO);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ username: "matheus", password: "87654321" });

      expect(response.status).toEqual(400);
      expect(response.body.message).toBe("invalid password");
    });
  });

  describe("/api/v1/auth/refresh", () => {
    it("should return 200 when success", async () => {
      const sessionDTO: SessionDTO = { userId: userDTO.id };

      const refreshToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 day")
        .sign(new TextEncoder().encode("REFRESH_TOKEN_SECRET"));

      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Authorization", `Bearer ${refreshToken}`);

      expect(response.status).toEqual(200);
      expect(typeof response.body.accessToken).toBe("string");
    });
  });
});
