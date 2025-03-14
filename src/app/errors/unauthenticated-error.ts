import { BaseError } from "./base-error";

export class UnauthenticatedError extends BaseError {
  constructor(params?: { message?: string }) {
    super({
      error: "UNAUTHENTICATED_ERROR",
      message: params?.message || "Unauthenticated",
    });
  }
}
