import type { Rating } from "../rating.entity";

export interface CreateRatingRepository {
  create(rating: Rating): Promise<void>;
}
