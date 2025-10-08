import { BaseError } from "./base-error";

export class UnauthorizedError extends BaseError {
  constructor(params?: { message?: string }) {
    super({
      code: "UNAUTHORIZED_ERROR",
      message: params?.message || "Unauthorized",
    });
  }
}
