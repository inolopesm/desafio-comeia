import express from "express";
import swaggerUi from "swagger-ui-express";
import packageJSON from "../package.json";
import { AuthController } from "./modules/auth/auth.controller";
import { RatingController } from "./modules/rating/rating.controller";
import { RouteAdapter } from "./route.adapter";

const app = express();

app.use(express.json());

const routeAdapter = new RouteAdapter(app);

routeAdapter.adapt(AuthController.login);
routeAdapter.adapt(AuthController.refresh);
routeAdapter.adapt(RatingController.find);
routeAdapter.adapt(RatingController.create);
routeAdapter.adapt(RatingController.update);
routeAdapter.adapt(RatingController.delete);

app.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup({
    openapi: "3.0.3",
    info: { title: packageJSON.name, version: packageJSON.version },
    paths: routeAdapter.getSwaggerPaths(),
  }),
);

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
