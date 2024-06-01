import { PipeHelper } from "./helpers/pipe.helper";
import type { Request } from "./interfaces/http.interface";
import type { Pipe } from "./interfaces/pipe.interface";

export class Context {
  constructor(private readonly request: Request) {}

  async getHeader(key: string, ...pipes: Pipe[]) {
    return await PipeHelper.transform(this.request.headers[key], ...pipes);
  }

  async getParam(key: string, ...pipes: Pipe[]) {
    return await PipeHelper.transform(this.request.params[key], ...pipes);
  }

  async getBody(...pipes: Pipe[]) {
    return await PipeHelper.transform(this.request.body, ...pipes);
  }
}
