import { MongoClient } from "mongodb";

export class Mongo {
  private static instance: Mongo | null = null;

  static getInstance() {
    if (Mongo.instance === null) Mongo.instance = new Mongo();
    return Mongo.instance;
  }

  private client: MongoClient | null = null;
  private connected = false;

  private constructor() {}

  async connect(url: string) {
    this.client = new MongoClient(url);
    this.connected = true;
  }

  async disconnect() {
    if (this.client === null) throw new Error("mongo client not connected");
    await this.client.close();
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }

  getCollection(name: string) {
    if (this.client === null) throw new Error("mongo client not connected");
    return this.client.db().collection(name);
  }
}
