export class BaseError<DataType = any> {
  error: string;
  message: string;
  data: DataType;

  constructor(params: { error: string; message: string; data?: any }) {
    this.error = params.error;
    this.message = params.message;
    this.data = params.data;
  }
}
