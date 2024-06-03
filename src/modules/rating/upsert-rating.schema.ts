import z from "zod";

/* eslint-disable prettier/prettier */
export const UpsertRatingSchema = z.object({
  rating: z
    .number({ invalid_type_error: "rating must be a number type", required_error: "rating is a required field" })
    .min(1, "rating must be greater than or equal to 1")
    .max(5, "rating must be less than or equal to 5"),

  comment: z
    .string({ invalid_type_error: "comment must be a string type", required_error: "comment is a required field" })
    .min(1, "must be at least 1 characters")
    .max(255, "must be at least 255 characters"),
});
/* eslint-enable prettier/prettier */

export type UpsertRatingDTO = z.infer<typeof UpsertRatingSchema>;

export const UpsertRatingSwagger = {
  type: "object",
  required: ["rating", "comment"],
  properties: {
    rating: { type: "number", example: 5 },
    comment: { type: "string" },
  },
};
