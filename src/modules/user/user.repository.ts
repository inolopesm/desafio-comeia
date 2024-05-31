import z from "zod";
import type { Mongo } from "@/mongo";
import type { FindUserByUsernameRepository } from "./find-by-username/find-user-by-username.repository";
import type { User } from "./user.entity";

export class UserRepository implements FindUserByUsernameRepository {
  private static readonly collectionName = "users";

  private static readonly schema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
  });

  constructor(private readonly mongo: Mongo) {}

  async findByUsername(username: string): Promise<User | null> {
    const document = await this.mongo
      .getCollection(UserRepository.collectionName)
      .findOne({ username });

    if (document === null) {
      return null;
    }

    return UserRepository.schema.parseAsync(document);
  }
}
