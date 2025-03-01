import { BaseError } from "./base-error";

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super({
      error: "INVALID_CREDENTIALS",
      message: "Invalid credentials",
    });
  }
}
