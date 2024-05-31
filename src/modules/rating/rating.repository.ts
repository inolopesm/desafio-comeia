import type { Mongo } from "../../mongo";
import { CreateRatingRepository } from "./create/create-rating.repository";
import { Rating } from "./rating.entity";

export class RatingRepository implements CreateRatingRepository {
  private static readonly collectionName = "ratings";

  constructor(private readonly mongo: Mongo) {}

  async create(rating: Rating): Promise<void> {
    await this.mongo
      .getCollection(RatingRepository.collectionName)
      .insertOne(rating);
  }
}
