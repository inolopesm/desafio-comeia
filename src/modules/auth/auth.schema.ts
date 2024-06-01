import z from "zod";

export const AuthSchema = z
  .string()
  .startsWith("Bearer ")
  .transform((arg) => arg.slice("Bearer ".length));
