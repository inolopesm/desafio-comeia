import z from "zod";
import { HttpException } from "../exceptions/http.exception";
import { Pipe } from "../interfaces/pipe.interface";

export class ZodPipe<T extends z.ZodTypeAny> implements Pipe {
  constructor(
    private readonly schema: T,
    private readonly statusCode = 400,
    private readonly message?: string,
  ) {}

  async transform(value: any): Promise<any> {
    try {
      return await this.schema.parseAsync(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        throw new HttpException(this.statusCode, this.message ?? messages);
      }

      throw error;
    }
  }
}
