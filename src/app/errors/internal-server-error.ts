import { BaseError } from "./base-error";

export class InternalServerError extends BaseError<{ error: any }> {
  constructor(params: { error: any }) {
    super({
      error: "INTERNAL_SERVER_ERROR",
      message: (() => {
        if (params.error instanceof Error) return params.error.message;
        if (typeof params.error === "string") return params.error;
        return "Unknown error";
      })(),
      data: {
        error: (() => {
          if (params.error instanceof Error) {
            return {
              name: params.error.name,
              message: params.error.message,
              stack: params.error.stack,
            };
          }
          return params.error;
        })(),
      },
    });
  }
}
