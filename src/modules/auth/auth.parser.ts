import jose from "jose";
import { z } from "zod";
import { ParserError } from "../../errors/parser.error";
import type { Parser } from "../../interfaces/parser.interface";
import type { SessionDTO } from "./session.dto";

export class AuthParser implements Parser<SessionDTO> {
  private static readonly inputSchema = z.object({
    authorization: z
      .string()
      .startsWith("Bearer ")
      .transform((value) => value.slice("Bearer ".length)),
  });

  private static readonly authorizationSchema = z.object({
    userId: z.string().uuid(),
  });

  private readonly secret: Uint8Array;

  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret);
  }

  async parse(input: unknown): Promise<SessionDTO> {
    try {
      const { authorization } = await AuthParser.inputSchema.parseAsync(input);
      const payload = await jose.jwtVerify(authorization, this.secret);
      return await AuthParser.authorizationSchema.parseAsync(payload);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ParserError("Não autorizado");
      }

      if (error instanceof jose.errors.JOSEError) {
        throw new ParserError("Não autorizado");
      }

      throw error;
    }
  }
}
