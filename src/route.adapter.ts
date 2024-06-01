import { Context } from "./context";
import { HttpException } from "./exceptions/http.exception";
import type { Request } from "./interfaces/http.interface";
import type { Route } from "./interfaces/route.interface";
import type e from "express";

export class RouteAdapter {
  constructor(private readonly app: e.Express) {}

  adapt(route: Route) {
    this.app[route.method](route.path, async (req, res, next) => {
      try {
        const request: Request = {
          headers: {},
          params: req.params,
          body: req.body,
        };

        for (const [key, value] of Object.entries(req.headers)) {
          if (value !== undefined) {
            request.headers[key] = value;
          }
        }

        const context = new Context(request);
        const data = await route.handler(context);

        if (data !== undefined) {
          res.send(data);
        }

        res.end();
      } catch (error) {
        if (error instanceof HttpException) {
          res.status(error.statusCode);
          res.send({ message: error.messageOrMessages });
          return;
        }

        next(error);
      }
    });
  }
}
