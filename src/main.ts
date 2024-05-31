import { app } from "./app";

const server = app.listen(3000);

["SIGINT", "SIGTERM"].map((event) =>
  process.on(event, () => {
    if (!server) return;

    server.close((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      process.exit(0);
    });
  })
);
