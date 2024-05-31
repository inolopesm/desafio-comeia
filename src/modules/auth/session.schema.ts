import z from "zod";

export const SessionSchema = z.object({ userId: z.string() });
