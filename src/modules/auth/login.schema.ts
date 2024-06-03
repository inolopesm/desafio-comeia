import z from "zod";

export const LoginSchema = z.object({
  username: z.string({
    invalid_type_error: "username must be a string type",
    required_error: "username is a required field",
  }),

  password: z.string({
    invalid_type_error: "password must be a string type",
    required_error: "password is a required field",
  }),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const LoginSwagger = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
};
