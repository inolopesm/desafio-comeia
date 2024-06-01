import crypto from "node:crypto";
import { UserRepository } from "../auth/user.repository";
import { RatingRepository } from "./rating.repository";

export const RatingService = {
  async find() {
    return await RatingRepository.find();
  },

  async create(userId: string, rating: number, comment: string) {
    const user = await UserRepository.findById(userId);

    if (user === null) {
      return new Error("user not found");
    }

    await RatingRepository.create({
      id: crypto.randomUUID(),
      userId,
      rating,
      comment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },

  async updateByIdAndUserId(
    id: string,
    userId: string,
    rating: number,
    comment: string,
  ) {
    const entity = await RatingRepository.findById(id);

    if (entity === null) {
      return new Error("rating not found");
    }

    if (entity.userId !== userId) {
      return new Error("forbidden");
    }

    await RatingRepository.updateById({
      id: entity.id,
      userId: entity.userId,
      rating,
      comment,
      createdAt: entity.createdAt,
      updatedAt: Date.now(),
    });

    return null;
  },

  async deleteByIdAndUserId(id: string, userId: string) {
    const rating = await RatingRepository.findById(id);

    if (rating === null) {
      return new Error("rating not found");
    }

    if (rating.userId !== userId) {
      return new Error("forbidden");
    }

    await RatingRepository.deleteById(id);

    return null;
  },
};
