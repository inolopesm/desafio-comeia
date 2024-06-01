import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type UserDTO = z.infer<typeof UserSchema>;
