import { BaseError } from "./base-error";

export class UnauthenticatedError extends BaseError {
  constructor(params?: { message?: string }) {
    super({
      code: "UNAUTHENTICATED_ERROR",
      message: params?.message || "Unauthenticated",
    });
  }
}
