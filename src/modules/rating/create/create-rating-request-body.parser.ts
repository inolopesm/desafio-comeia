import { z } from "zod";
import { ParserError } from "../../../errors/parser.error";
import type { Parser } from "../../../interfaces/parser.interface";
import type { CreateRatingRequestBody } from "./create-rating.controller";

export class CreateRatingRequestBodyParser
  implements Parser<CreateRatingRequestBody>
{
  /* eslint-disable prettier/prettier */
  private static readonly schema = z.object({
    rating: z
      .number({ invalid_type_error: "nota deve ser do tipo number", required_error: "nota é um campo obrigatório" })
      .min(1, "nota deve ser maior ou igual a 1")
      .max(5, "nota deve ser menor ou igual a 5"),

    comment: z
      .string({ invalid_type_error: "comentário deve ser do tipo string", required_error: "comentário é um campo obrigatório" })
      .min(1, "comentário não pode estar vazio")
      .max(255, "comentário deve ter no máximo 255 caracteres"),
  });
  /* eslint-enable prettier/prettier */

  async parse(input: unknown): Promise<CreateRatingRequestBody> {
    try {
      return await CreateRatingRequestBodyParser.schema.parseAsync(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        const message = new Intl.ListFormat("pt-BR").format(messages);
        throw new ParserError(message);
      }

      throw error;
    }
  }
}
