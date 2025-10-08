import { BaseError } from "./base-error";

export class InvalidInputsError extends BaseError<{
  inputs: Record<string, string>;
}> {
  constructor(params?: { inputs?: Record<string, string> }) {
    super({
      code: "INVALID_INPUTS",
      message: "Invalid inputs",
      data: {
        inputs: params?.inputs ?? {},
      },
    });
  }

  addInputError(name: string, message: string) {
    this.data.inputs[name] = message;
  }

  hasInputErrors() {
    return Object.keys(this.data.inputs).length > 0;
  }
}
