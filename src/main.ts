import { app } from "./app";
import { ConfigProvider } from "./providers/config.provider";
import { MongoProvider } from "./providers/mongo.provider";

const MONGO_URL = ConfigProvider.getOrThrow("MONGO_URL");
MongoProvider.connect(MONGO_URL).then(() => app.listen(3000));
