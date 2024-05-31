import { MongoProvider } from "../../providers/mongo.provider";
import { UserSchema } from "./user.schema";
import type { User } from "./user.entity";

export const AuthRepository = {
  async findUserByUsername(username: string): Promise<User | null> {
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
