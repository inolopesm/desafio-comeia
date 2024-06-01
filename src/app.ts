import express from "express";
import { AuthController } from "./modules/auth/auth.controller";
import { RatingController } from "./modules/rating/rating.controller";
import { adaptRoute } from "./route.adapter";

const app = express();

app.use(express.json());

adaptRoute(AuthController.login, app);
adaptRoute(AuthController.refresh, app);
adaptRoute(RatingController.find, app);
adaptRoute(RatingController.create, app);
adaptRoute(RatingController.update, app);
adaptRoute(RatingController.delete, app);

app.use((request, response) => {
  response.status(404);
  response.send({ message: "Route not found" });
});

app.use(
  (
    error: unknown,
    request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    response.status(500);
    response.send({ message: "Internal Server Error" });
  },
);

export { app };
