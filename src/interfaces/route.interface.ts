import type { Context } from "../context";

export interface Route {
  method: "get" | "post" | "put" | "delete";
  path: string;
  handler: (context: Context) => Promise<any>;
}
