export class HttpException extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = HttpException.name;
    this.statusCode = statusCode;
  }
}
