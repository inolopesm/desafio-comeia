import crypto from "node:crypto";
import { UserRepository } from "../auth/user.repository";
import { UserDTO } from "../auth/user.schema";
import { RatingRepository } from "./rating.repository";
import { RatingDTO } from "./rating.schema";
import { RatingService } from "./rating.service";

const userDTO: UserDTO = {
  id: "id",
  username: "username",
  password: "password",
  createdAt: 1,
  updatedAt: 2,
};

const ratingDTO: RatingDTO = {
  id: "id",
  userId: "userId",
  rating: 5,
  comment: "comment",
  createdAt: 3,
  updatedAt: 4,
};

jest.mock("../auth/user.repository", () => ({
  UserRepository: {
    async findById() {
      return userDTO;
    },
  },
}));

jest.mock("./rating.repository", () => ({
  RatingRepository: {
    async find() {
      return [ratingDTO, ratingDTO];
    },

    async findById() {
      return ratingDTO;
    },

    async create() {
      //
    },

    async updateById() {
      //
    },

    async deleteById() {
      //
    },
  },
}));

describe("RatingService", () => {
  describe("find", () => {
    it("should return an array of ratings", async () => {
      const result = await RatingService.find();
      expect(result).toEqual([ratingDTO, ratingDTO]);
    });
  });

  describe("create", () => {
    it("should return an error if the user is not found", async () => {
      jest.spyOn(UserRepository, "findById").mockResolvedValueOnce(null);
      const result = await RatingService.create("userId", 5, "comment");
      expect(result).toEqual(new Error("user not found"));
    });

    it("should call RatingRepository.create with correct params", async () => {
      jest
        .spyOn(crypto, "randomUUID")
        .mockImplementationOnce(() => "00000000-0000-0000-0000-000000000000");

      let counter = 0;

      const nowSpy = jest
        .spyOn(Date, "now")
        .mockImplementation(() => counter++);

      const createSpy = jest.spyOn(RatingRepository, "create");
      const result = await RatingService.create("userId", 5, "comment");
      nowSpy.mockRestore();

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();

      expect(createSpy).toHaveBeenCalledWith({
        id: "00000000-0000-0000-0000-000000000000",
        userId: "userId",
        rating: 5,
        comment: "comment",
        createdAt: 0,
        updatedAt: 1,
      } satisfies RatingDTO);
    });
  });

  describe("updateByIdAndUserId", () => {
    it("should return an error if the rating is not found", async () => {
      jest.spyOn(RatingRepository, "findById").mockResolvedValueOnce(null);
      const args = ["id", "userId", 5, "comment"] as const;
      const result = await RatingService.updateByIdAndUserId(...args);
      expect(result).toEqual(new Error("rating not found"));
    });

    it("should return an error if the userId provided is different from founded rating", async () => {
      const args = ["id", "anotherUserId", 5, "comment"] as const;
      const result = await RatingService.updateByIdAndUserId(...args);
      expect(result).toEqual(new Error("forbidden"));
    });

    it("should call RatingRepository.updateById with correct params", async () => {
      const updateByIdSpy = jest.spyOn(RatingRepository, "updateById");
      let counter = 0;

      const nowSpy = jest
        .spyOn(Date, "now")
        .mockImplementation(() => counter++);

      const args = ["id", "userId", 4, "another comment"] as const;
      const result = await RatingService.updateByIdAndUserId(...args);
      nowSpy.mockRestore();

      expect(updateByIdSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();

      expect(updateByIdSpy).toHaveBeenCalledWith({
        id: "id",
        userId: "userId",
        rating: 4,
        comment: "another comment",
        createdAt: 3,
        updatedAt: 0,
      } satisfies RatingDTO);
    });
  });

  describe("deleteByIdAndUserId", () => {
    it("should return an error if the rating is not found", async () => {
      jest.spyOn(RatingRepository, "findById").mockResolvedValueOnce(null);
      const result = await RatingService.deleteByIdAndUserId("id", "userId");
      expect(result).toEqual(new Error("rating not found"));
    });

    it("should return an error if the userId provided is different from founded rating", async () => {
      const result = await RatingService.deleteByIdAndUserId("id", "otherId");
      expect(result).toEqual(new Error("forbidden"));
    });

    it("should call RatingRepository.deleteById with correct id", async () => {
      const deleteByIdSpy = jest.spyOn(RatingRepository, "deleteById");
      const result = await RatingService.deleteByIdAndUserId("id", "userId");
      expect(deleteByIdSpy).toHaveBeenCalledWith("id");
      expect(deleteByIdSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });
});
