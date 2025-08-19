export class BaseError<DataType = undefined> {
  code: string;
  message: string;
  data: DataType;

  constructor(params: { code: string; message: string; data?: any }) {
    this.code = params.code;
    this.message = params.message;
    this.data = params.data;
  }
}
