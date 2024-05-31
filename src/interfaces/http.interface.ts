export interface Request {
  headers: Record<string, string | string[]>;
  body?: unknown;
  session?: { userId: string };
}

export interface Response {
  body?: unknown;
}

export interface Controller {
  handle(request: Request): Promise<Response>;
}
