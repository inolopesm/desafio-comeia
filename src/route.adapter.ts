import z from "zod";
import type e from "express";

interface RouteHandlerOutput {
  statusCode: number;
  body: unknown;
}

export interface RouteInput<TSchema extends z.AnyZodObject> {
  method: "get" | "post" | "put" | "delete";
  path: string;
  schema: TSchema;
  handler: (req: z.infer<TSchema>) => Promise<RouteHandlerOutput>;
}

export const adaptRoute =
  <TSchema extends z.AnyZodObject>(input: RouteInput<TSchema>) =>
  (app: e.Express) =>
    app[input.method](input.path, async (req, res, next) => {
      try {
        let request: z.infer<TSchema>;

        try {
          request = await input.schema.parseAsync(req);
        } catch (error) {
          if (error instanceof z.ZodError) {
            res.status(400);
            res.send({ message: error.issues.map((issue) => issue.message) });
            return;
          }

          throw error;
        }

        const response = await input.handler(request);
        res.status(response.statusCode);
        res.send(response.body);
      } catch (error) {
        next(error);
      }
    });
