import type { User } from "../user.entity";

export interface FindUserByUsernameRepository {
  findByUsername(username: string): Promise<User | null>;
}
