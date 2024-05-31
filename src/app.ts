import express from "express";
import { adaptRoute } from "./adapters";
import { HttpException } from "./exceptions/http.exception";
import { env } from "./constants";
import { AuthParser } from "./modules/auth/auth.parser";
import { CreateRatingController } from "./modules/rating/create/create-rating.controller";
import { CreateRatingRequestBodyParser } from "./modules/rating/create/create-rating-request-body.parser";
import { RatingRepository } from "./modules/rating/rating.repository";
import { Mongo } from "./mongo";
import { LoginController } from "./modules/auth/login/login.controller";
import { UserRepository } from "./modules/user/user.repository";

const app = express();

app.post(
  "/api/v1/login",
  adaptRoute(
    new LoginController(
      new UserRepository(Mongo.getInstance()),
      env.JWT_ACCESS_SECRET,
      env.JWT_REFRESH_SECRET,
    ),
  ),
);

app.post(
  "/api/v1/ratings",
  adaptRoute(
    new CreateRatingController(
      new AuthParser(SECRET),
      new CreateRatingRequestBodyParser(),
      new RatingRepository(Mongo.getInstance()),
    ),
  ),
);

app.all("*", (request, response, _next) => {
  response.status(404);
  response.send({ message: "Route not found" });
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof HttpException) {
      response.status(error.statusCode);
      response.send({ message: error.message });
      return;
    }

    console.error(error);
    response.status(500);
    response.send({ message: "Internal Server Error" });
  },
);

export { app };
