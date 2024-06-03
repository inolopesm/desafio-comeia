import crypto from "node:crypto";
import * as jose from "jose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../src/app";
import { SessionDTO } from "../src/modules/auth/session.schema";
import { UserDTO } from "../src/modules/auth/user.schema";
import { RatingDTO } from "../src/modules/rating/rating.schema";
import { UpsertRatingDTO } from "../src/modules/rating/upsert-rating.schema";
import { MongoProvider } from "../src/providers/mongo.provider";

jest.mock("../src/modules/auth/auth.constants", () => ({
  ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
  REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
}));

describe("Rating Module", () => {
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
    await MongoProvider.getClient().db().collection("ratings").deleteMany();
  });

  describe("GET /api/v1/ratings", () => {
    it("should return 200 when success", async () => {
      const ratings: [RatingDTO, RatingDTO] = [
        {
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          rating: crypto.randomInt(5) + 1,
          comment: "comment",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "id",
          userId: crypto.randomUUID(),
          rating: crypto.randomInt(5) + 1,
          comment: "comment",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      await MongoProvider.getClient()
        .db()
        .collection("ratings")
        .insertMany(structuredClone(ratings));

      const sessionDTO: SessionDTO = { userId: crypto.randomUUID() };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .get("/api/v1/ratings")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(ratings);
    });
  });

  describe("GET /api/v1/ratings/:id", () => {
    it("should return 400 if rating has not found", async () => {
      const ratingId = crypto.randomUUID();

      const sessionDTO: SessionDTO = { userId: crypto.randomUUID() };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .get(`/api/v1/ratings/${ratingId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: "rating not found" });
    });

    it("should return 200 when success", async () => {
      const user: UserDTO = {
        id: crypto.randomUUID(),
        username: "matheus",
        password: `$argon2id$v=19$m=65536,t=3,p=4$SzGuC08WqCVW3sWK7F6APQ$Dg184GXflcE+V+7Dmfx75scJt7njwuqFmW0xrviVSCo`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const userWithoutPassword: Omit<UserDTO, "password"> = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      await MongoProvider.getClient()
        .db()
        .collection("users")
        .insertOne(structuredClone(user));

      const rating: RatingDTO = {
        id: crypto.randomUUID(),
        userId: user.id,
        rating: 1,
        comment: "comment",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await MongoProvider.getClient()
        .db()
        .collection("ratings")
        .insertOne(structuredClone(rating));

      const sessionDTO: SessionDTO = { userId: user.id };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .get(`/api/v1/ratings/${rating.id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ ...rating, user: userWithoutPassword });
    });
  });

  describe("POST /api/v1/ratings", () => {
    it("should return 400 if user has not found", async () => {
      const upsertRatingDTO: UpsertRatingDTO = {
        rating: crypto.randomInt(5) + 1,
        comment: "comment",
      };

      const sessionDTO: SessionDTO = { userId: crypto.randomUUID() };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .post("/api/v1/ratings")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(upsertRatingDTO);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: "user not found" });
    });

    it("should return 200 when success", async () => {
      const user: UserDTO = {
        id: crypto.randomUUID(),
        username: "matheus",
        password: `$argon2id$v=19$m=65536,t=3,p=4$SzGuC08WqCVW3sWK7F6APQ$Dg184GXflcE+V+7Dmfx75scJt7njwuqFmW0xrviVSCo`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await MongoProvider.getClient()
        .db()
        .collection("users")
        .insertOne(structuredClone(user));

      const upsertRatingDTO: UpsertRatingDTO = {
        rating: crypto.randomInt(5) + 1,
        comment: "comment",
      };

      const sessionDTO: SessionDTO = { userId: user.id };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .post("/api/v1/ratings")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(upsertRatingDTO);

      expect(response.status).toEqual(200);

      const documents = await MongoProvider.getClient()
        .db()
        .collection("ratings")
        .find()
        .toArray();

      expect(documents).toHaveLength(1);

      for (const document of documents) {
        expect(typeof document.id).toBe("string");
        expect(document.userId).toBe(sessionDTO.userId);
        expect(document.rating).toBe(upsertRatingDTO.rating);
        expect(document.comment).toBe(upsertRatingDTO.comment);
        expect(typeof document.createdAt).toBe("number");
        expect(typeof document.updatedAt).toBe("number");
      }
    });
  });

  describe("PUT /api/v1/ratings/:id", () => {
    it("should return 400 if rating has not found", async () => {
      const ratingId = crypto.randomUUID();

      const upsertRatingDTO: UpsertRatingDTO = {
        rating: crypto.randomInt(5) + 1,
        comment: "comment",
      };

      const sessionDTO: SessionDTO = { userId: crypto.randomUUID() };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .put(`/api/v1/ratings/${ratingId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(upsertRatingDTO);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: "rating not found" });
    });

    it("should return 400 if the userId provided is different from founded rating", async () => {
      const rating: RatingDTO = {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        rating: 1,
        comment: "comment",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await MongoProvider.getClient()
        .db()
        .collection("ratings")
        .insertOne(structuredClone(rating));

      const upsertRatingDTO: UpsertRatingDTO = {
        rating: 2,
        comment: "another comment",
      };

      const sessionDTO: SessionDTO = { userId: crypto.randomUUID() };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .put(`/api/v1/ratings/${rating.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(upsertRatingDTO);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: "forbidden" });
    });

    it("should return 200 when success", async () => {
      const rating: RatingDTO = {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        rating: 1,
        comment: "comment",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await MongoProvider.getClient()
        .db()
        .collection("ratings")
        .insertOne(structuredClone(rating));

      const upsertRatingDTO: UpsertRatingDTO = {
        rating: 2,
        comment: "another comment",
      };

      const sessionDTO: SessionDTO = { userId: rating.userId };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .put(`/api/v1/ratings/${rating.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(upsertRatingDTO);

      expect(response.status).toEqual(200);
    });
  });

  describe("DELETE /api/v1/ratings/:id", () => {
    it("should return 400 if rating has not found", async () => {
      const ratingId = crypto.randomUUID();
      const sessionDTO: SessionDTO = { userId: crypto.randomUUID() };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .delete(`/api/v1/ratings/${ratingId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: "rating not found" });
    });

    it("should return 400 if the userId provided is different from founded rating", async () => {
      const rating: RatingDTO = {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        rating: 1,
        comment: "comment",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await MongoProvider.getClient()
        .db()
        .collection("ratings")
        .insertOne(structuredClone(rating));

      const sessionDTO: SessionDTO = { userId: crypto.randomUUID() };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .delete(`/api/v1/ratings/${rating.id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: "forbidden" });
    });

    it("should return 200 when success", async () => {
      const rating: RatingDTO = {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        rating: 1,
        comment: "comment",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await MongoProvider.getClient()
        .db()
        .collection("ratings")
        .insertOne(structuredClone(rating));

      const sessionDTO: SessionDTO = { userId: rating.userId };

      const accessToken = await new jose.SignJWT({ ...sessionDTO })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5 minutes")
        .sign(new TextEncoder().encode("ACCESS_TOKEN_SECRET"));

      const response = await request(app)
        .delete(`/api/v1/ratings/${rating.id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
    });
  });
});
