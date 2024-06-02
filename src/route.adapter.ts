import { Context } from "./context";
import { HttpException } from "./exceptions/http.exception";
import type { Request } from "./interfaces/http.interface";
import type { Route } from "./interfaces/route.interface";
import type e from "express";

export class RouteAdapter {
  private readonly swaggerPaths: Record<string, unknown> = {};

  constructor(private readonly app: e.Express) {}

  private swagger(route: Route) {
    if (route.swagger !== undefined) {
      this.swaggerPaths[route.path] = {
        [route.method]: {
          tags: route.swagger.tags,
          parameters: route.swagger.parameters,
          requestBody: route.swagger.requestBody,
          responses: route.swagger.responses,
        },
      };
    }
  }

  private router(route: Route) {
    this.app[route.method](route.path, async (req, res, next) => {
      try {
        const headers: Request["headers"] = {};

        for (const [key, value] of Object.entries(req.headers))
          if (value !== undefined) headers[key] = value;

        const request: Request = {
          headers,
          params: req.params,
          body: req.body,
        };

        const context = new Context(request);
        const data = await route.handler(context);

        if (data !== undefined) {
          res.send(data);
        }

        res.end();
      } catch (error) {
        if (error instanceof HttpException) {
          res.status(error.statusCode);
          res.send({ message: error.message });
          return;
        }

        next(error);
      }
    });
  }

  adapt(route: Route) {
    this.router(route);
    this.swagger(route);
  }

  getSwaggerPaths() {
    return this.swaggerPaths;
  }
}
