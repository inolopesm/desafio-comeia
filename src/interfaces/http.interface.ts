export interface Request {
  headers: Record<string, string | string[]>;
  params: Record<string, string>;
  body: any;
}

export interface Response {
  statusCode: number;
  body?: any;
}
