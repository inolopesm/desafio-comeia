import { HttpException } from "../exceptions/http.exception";
import type { Pipe } from "../interfaces/pipe.interface";

export class UUIDPipe implements Pipe {
  constructor(
    private readonly key: string,
    private readonly statusCode = 400,
    private readonly message?: string,
  ) {}

  async transform(value: any): Promise<any> {
    if (value === undefined) {
      const message = `${this.key} is a required field`;
      throw new HttpException(this.statusCode, this.message ?? message);
    }

    if (typeof value !== "string") {
      const message = `${this.key} must be a string type`;
      throw new HttpException(this.statusCode, this.message ?? message);
    }

    const UUID_REGEX =
      /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

    if (!UUID_REGEX.test(value)) {
      const message = `${this.key} must be a valid UUID`;
      throw new HttpException(this.statusCode, this.message ?? message);
    }

    return value;
  }
}
