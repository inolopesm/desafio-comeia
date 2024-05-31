import express from "express";
import { AuthController } from "./modules/auth/auth.controller";

const app = express();

app.use(express.json());

AuthController.login(app);
AuthController.refresh(app);

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
