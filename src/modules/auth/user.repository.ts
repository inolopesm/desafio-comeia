import { MongoProvider } from "../../providers/mongo.provider";
import { UserSchema } from "./user.schema";

export const UserRepository = {
  async findById(id: string) {
    const document = await MongoProvider.getClient()
      .db()
      .collection("users")
      .findOne({ id });

    if (document === null) {
      return null;
    }

    return await UserSchema.parseAsync(document);
  },

  async findByUsername(username: string) {
    const document = await MongoProvider.getClient()
      .db()
      .collection("users")
      .findOne({ username });

    if (document === null) {
      return null;
    }

    return await UserSchema.parseAsync(document);
  },
};
