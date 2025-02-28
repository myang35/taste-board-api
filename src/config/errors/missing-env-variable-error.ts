export class MissingEnvVariableError extends Error {
  constructor(envVariable: string) {
    super();
    this.name = "MissingEnvVariableError";
    this.message = `${envVariable} variable is required in your environment`;
  }
}
