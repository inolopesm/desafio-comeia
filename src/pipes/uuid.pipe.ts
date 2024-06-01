import z from "zod";
import { ZodPipe } from "./zod.pipe";
import type { Pipe } from "../interfaces/pipe.interface";

export class UUIDPipe implements Pipe {
  private readonly Schema: z.ZodString;

  constructor(key: string) {
    /* eslint-disable prettier/prettier */
    this.Schema = z
      .string({ invalid_type_error: `${key} must be a string type`, required_error: `${key} is a required field` })
      .uuid(`${key} must be a valid UUID`);
    /* eslint-disable prettier/prettier */
  }

  async transform(value: any): Promise<any> {
    return new ZodPipe(this.Schema).transform(value);
  }
}
