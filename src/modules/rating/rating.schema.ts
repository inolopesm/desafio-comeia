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

export const RatingSwagger = {
  type: "object",
  required: ["id", "userId", "rating", "comment", "createdAt", "updatedAt"],
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
    rating: { type: "number", example: 5 },
    comment: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
};
