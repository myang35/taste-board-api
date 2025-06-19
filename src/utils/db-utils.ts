import { Ref } from "@typegoose/typegoose";
import { DocumentType, RefType } from "@typegoose/typegoose/lib/types";
import { isObjectIdOrHexString } from "mongoose";

export const dbUtils = {
  isPopulated: <T>(doc: Ref<T, RefType> | null): doc is DocumentType<T> => {
    return !isObjectIdOrHexString(doc);
  },
};
