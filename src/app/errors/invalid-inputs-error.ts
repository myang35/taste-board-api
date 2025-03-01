import { BaseError } from "./base-error";

export interface InvalidInputsErrorInput {
  name: string;
  message: string;
}

export class InvalidInputsError extends BaseError<{
  inputs: InvalidInputsErrorInput[];
}> {
  constructor(params: { inputs: InvalidInputsErrorInput[] }) {
    super({
      error: "INVALID_INPUTS",
      message: "Invalid inputs",
      data: {
        inputs: params.inputs,
      },
    });
  }
}
