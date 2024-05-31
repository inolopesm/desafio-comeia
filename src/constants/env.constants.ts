if (typeof process.env.JWT_ACCESS_SECRET !== "string") {
  throw new Error("env JWT_ACCESS_SECRET not found");
}

if (typeof process.env.JWT_REFRESH_SECRET !== "string") {
  throw new Error("env JWT_REFRESH_SECRET not found");
}

if (typeof process.env.MONGO_URL !== "string") {
  throw new Error("env MONGO_URL not found");
}

export const env = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  MONGO_URL: process.env.MONGO_URL,
};
