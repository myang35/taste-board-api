import { stringUtils } from "@src/utils/string-utils";
import { BaseError } from "./base-error";

export class ResourceNotFoundError extends BaseError {
  constructor(params: { resource: string }) {
    super({
      error: "RESOURCE_NOT_FOUND",
      message: `${stringUtils.firstUpper(params.resource)} is not found`,
    });
  }
}
