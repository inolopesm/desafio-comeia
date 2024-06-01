import { PipeHelper } from "../../helpers/pipe.helper";
import { JWTPipe } from "../../pipes/jwt.pipe";
import { ZodPipe } from "../../pipes/zod.pipe";
import { ACCESS_TOKEN_SECRET } from "./auth.constants";
import { AuthSchema } from "./auth.schema";
import { SessionSchema } from "./session.schema";
import type { Pipe } from "../../interfaces/pipe.interface";

export class AuthPipe implements Pipe {
  async transform(value: any): Promise<any> {
    return PipeHelper.transform(
      value,
      new ZodPipe(AuthSchema, 401, "unauthorized"),
      new JWTPipe(ACCESS_TOKEN_SECRET, 401, "unauthorized"),
      new ZodPipe(SessionSchema, 401, "unauthorized"),
    );
  }
}
