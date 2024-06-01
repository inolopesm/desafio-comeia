export interface Pipe {
  transform(value: any): Promise<any>;
}
