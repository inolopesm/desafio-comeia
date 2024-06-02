import { MongoClient } from "mongodb";

const kClient = Symbol("kClient");

export const MongoProvider = {
  [kClient]: null as MongoClient | null,

  getClient() {
    if (this[kClient] === null) {
      throw new Error("mongo client not connected");
    }

    return this[kClient];
  },

  async connect(url: string) {
    this[kClient] = new MongoClient(url);
    await this[kClient].connect();
  },

  async disconnect() {
    if (this[kClient] === null) {
      throw new Error("mongo client not connected");
    }

    await this[kClient].close();
  },
};
