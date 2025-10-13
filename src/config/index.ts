import { S3Client } from "@aws-sdk/client-s3";
import { devConfig } from "./config.dev";
import { prodConfig } from "./config.prod";
import { requireVar } from "./utils/require-var";

export const config = {
  jwtSecret: requireVar("JWT_SECRET"),
  mongodbUri: requireVar("MONGODB_URI"),
  awsAccessKey: requireVar("AWS_ACCESS_KEY"),
  awsSecretKey: requireVar("AWS_SECRET_KEY"),
  s3BucketName: requireVar("S3_BUCKET_NAME"),
  s3BucketUrl: `https://${requireVar("S3_BUCKET_NAME")}.s3.${requireVar(
    "S3_BUCKET_REGION"
  )}.amazonaws.com`,
  s3Client: new S3Client({
    region: requireVar("S3_BUCKET_REGION"),
    credentials: {
      accessKeyId: requireVar("AWS_ACCESS_KEY"),
      secretAccessKey: requireVar("AWS_SECRET_KEY"),
    },
  }),
  ...(process.env.NODE_ENV === "production" ? prodConfig : devConfig),
};
