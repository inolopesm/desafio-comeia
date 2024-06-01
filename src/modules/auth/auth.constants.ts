import { ConfigProvider } from "../../providers/config.provider";

export const ACCESS_TOKEN_SECRET = ConfigProvider.getOrThrow(
  "ACCESS_TOKEN_SECRET",
);

export const REFRESH_TOKEN_SECRET = ConfigProvider.getOrThrow(
  "REFRESH_TOKEN_SECRET",
);
