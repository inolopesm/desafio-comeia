import type { Server } from "node:http";
import { promisify } from "node:util";
import { MONGO_URL } from "./constants/environment.constants";
import { app } from "./app";
import { Mongo } from "./mongo";

const mongo = Mongo.getInstance();
let server: Server | null = null;

mongo.connect(MONGO_URL).then(() => {
  server = app.listen(3000);
});

["SIGINT", "SIGTERM"].map((event) => {
  process.on(event, async () => {
    try {
      if (mongo.isConnected()) {
        await mongo.disconnect();
      }

      if (server !== null) {
        await promisify(server.close)();
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
});
