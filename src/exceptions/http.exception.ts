export class HttpException extends Error {
  statusCode: number;
  messageOrMessages: string | string[];

  constructor(statusCode: number, messageOrMessages: string | string[]) {
    super();
    this.statusCode = statusCode;
    this.messageOrMessages = messageOrMessages;
  }
}
