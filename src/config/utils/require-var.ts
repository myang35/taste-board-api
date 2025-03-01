import { MissingEnvVariableError } from "@src/config/errors/missing-env-variable-error";

export function requireVar(envVariable: string) {
  const result = process.env[envVariable];
  if (!result) {
    throw new MissingEnvVariableError(envVariable);
  }
  return result;
}
