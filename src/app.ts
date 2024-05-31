import express from "express";

const app = express();

app.all("*", (request, response, next) => {
  response.status(404);
  response.send({ message: "Route not found" });
});

export { app };
