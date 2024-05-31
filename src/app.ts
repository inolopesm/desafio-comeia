import express from "express";

const app = express();

app.all("*", (request, response, next) => {
  response.status(404);
  response.send({ message: "Route not found" });
});

app.use(
  (
    error: unknown,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    console.error(error);
    response.status(500);
    response.send({ message: "Internal Server Error" });
  }
);

export { app };
