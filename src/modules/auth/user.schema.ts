import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type UserDTO = z.infer<typeof UserSchema>;

export const UserSwagger = {
  type: "object",
  required: ["id", "username", "password", "createdAt", "updatedAt"],
  properties: {
    id: { type: "string" },
    username: { type: "string" },
    password: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
};
