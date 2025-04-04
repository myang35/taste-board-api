import { Request } from "express";

export const queryUtils = {
  toString: (query: Request["query"][string]) => {
    let value;
    if (query instanceof Array) {
      value = query[0];
    } else {
      value = query;
    }
    if (typeof value !== "string") {
      return undefined;
    }
    return value;
  },
  toInt: (query: Request["query"][string]) => {
    let value;
    if (query instanceof Array) {
      value = query[0];
    } else {
      value = query;
    }
    if (typeof value !== "string") {
      return undefined;
    }
    return parseInt(value);
  },
};
