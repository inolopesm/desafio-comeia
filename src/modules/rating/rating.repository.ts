import { MongoProvider } from "../../providers/mongo.provider";
import { RatingDTO, RatingSchema } from "./rating.schema";

export const RatingRepository = {
  async find() {
    const documents = await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .find()
      .toArray();

    return await RatingSchema.array().parseAsync(documents);
  },

  async findById(id: string) {
    const document = await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .findOne({ id });

    if (document === null) {
      return null;
    }

    return await RatingSchema.parseAsync(document);
  },

  async create(rating: RatingDTO) {
    await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .insertOne(rating);
  },

  async updateById(rating: RatingDTO) {
    const { id, ...data } = rating;

    await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .updateOne({ id }, { $set: data });
  },

  async deleteById(id: string) {
    await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .deleteOne({ id });
  },
};
