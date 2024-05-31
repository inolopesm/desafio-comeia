import type e from "express";
import type { Controller } from "../interfaces/controller.interface";
import type { Request } from "../interfaces/http.interface";

/** We use closure because express changes "this" */
export const adaptRoute =
  (controller: Controller) =>
  async (req: e.Request, res: e.Response, next: e.NextFunction) => {
    try {
      const request: Request = {
        headers: {},
        body: req.body,
      };

      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        request.headers[key] = value;
      }

      const response = await controller.handle(request);

      if (response.body) {
        res.send(response.body);
      }

      res.end();
    } catch (error) {
      next(error);
    }
  };
