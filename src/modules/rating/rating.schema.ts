import z from "zod";

export const RatingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type RatingDTO = z.infer<typeof RatingSchema>;
