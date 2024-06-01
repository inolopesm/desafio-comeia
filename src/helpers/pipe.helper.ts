import type { Pipe } from "../interfaces/pipe.interface";

export const PipeHelper = {
  async transform(value: any, ...pipes: Pipe[]) {
    return await pipes.reduce(
      (promise, pipe) => promise.then((arg) => pipe.transform(arg)),
      Promise.resolve(value),
    );
  },
};
