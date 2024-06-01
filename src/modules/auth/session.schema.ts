import z from "zod";

export const SessionSchema = z.object({ userId: z.string() });

export type SessionDTO = z.infer<typeof SessionSchema>;
