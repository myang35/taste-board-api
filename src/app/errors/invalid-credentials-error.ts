import { BaseError } from "./base-error";

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super({
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials",
    });
  }
}
