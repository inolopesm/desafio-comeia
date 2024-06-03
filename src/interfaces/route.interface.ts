import type { Context } from "../context";

export interface Route {
  method: "get" | "post" | "put" | "delete";
  path: string;
  handler: (context: Context) => Promise<any>;

  swagger?: {
    tags: string[];

    parameters?: Array<{
      in: string;
      name: string;
      schema: Record<string, unknown>;
      required?: boolean;
    }>;

    requestBody?: {
      content: {
        "application/json": {
          schema: Record<string, unknown>;
        };
      };
    };

    responses: {
      [statusCode: string]: {
        description: string;
        content?: {
          "application/json": {
            schema: Record<string, unknown>;
          };
        };
      };
    };
  };
}
