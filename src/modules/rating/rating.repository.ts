import { MongoProvider } from "../../providers/mongo.provider";
import { UserSchema } from "../auth/user.schema";
import { RatingDTO, RatingSchema } from "./rating.schema";

export const RatingRepository = {
  async find() {
    const documents = await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .find()
      .sort({ createdAt: 1 })
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

  async findByIdWithUserWithoutPassword(id: string) {
    const pipeline = [
      {
        $match: {
          id: id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ];

    const documents = await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .aggregate(pipeline)
      .toArray();

    const [document] = documents;

    /* eslint-disable prettier/prettier */
    return document
      ? await RatingSchema.extend({ user: UserSchema.omit({ password: true }) }).parseAsync(document)
      : null;
    /* eslint-enable prettier/prettier */
  },

  async create(rating: RatingDTO) {
    await MongoProvider.getClient()
      .db()
      .collection("ratings")
      .insertOne(structuredClone(rating));
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
