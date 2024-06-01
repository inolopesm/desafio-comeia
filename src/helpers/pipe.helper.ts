import type { Pipe } from "../interfaces/pipe.interface";

export const PipeHelper = {
  async transform(value: any, ...pipes: Pipe[]) {
    let finalValue = value;

    for (const pipe of pipes) {
      finalValue = await pipe.transform(value);
    }

    return finalValue;
  },
};
