import { HttpException } from "../exceptions/http.exception";
import { JWTHelper } from "../helpers/jwt.helper";
import { Pipe } from "../interfaces/pipe.interface";

export class JWTPipe implements Pipe {
  constructor(
    private readonly secret: string,
    private readonly statusCode = 400,
    private readonly message?: string,
  ) {}

  async transform(value: any): Promise<any> {
    const result = await JWTHelper.decrypt(value, this.secret);

    if (result instanceof Error) {
      throw new HttpException(this.statusCode, this.message ?? result.message);
    }

    return result;
  }
}
