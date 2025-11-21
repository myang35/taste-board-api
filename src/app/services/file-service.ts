import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "@src/config";
import { normalize } from "path";
import sharp from "sharp";

export const fileService = {
  getImageUrl: async (key: string) => {
    if (key.startsWith("public/")) {
      return normalizeUrl(`${config.s3BucketUrl}/${key}`);
    }
    return createPresignedUrl(key);
  },
  storeImage: async (
    file: Express.Multer.File,
    options?: {
      isPublic?: boolean;
    }
  ) => {
    const key = generateKey(!!options?.isPublic);
    const buffer = await resizeImage(file.buffer);
    await config.s3Client.send(
      new PutObjectCommand({
        Bucket: config.s3BucketName,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      })
    );
    return key;
  },
  updateImage: async (key: string, file: Express.Multer.File) => {
    const buffer = await resizeImage(file.buffer);
    await config.s3Client.send(
      new PutObjectCommand({
        Bucket: config.s3BucketName,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      })
    );
    return key;
  },
  deleteImage: async (key: string) => {
    await config.s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.s3BucketName,
        Key: key,
      })
    );
    return "";
  },
  moveToPublic: async (key: string) => {
    if (key.startsWith("public/")) {
      return key;
    }
    const newKey = normalize(`public/${key}`);
    await config.s3Client.send(
      new CopyObjectCommand({
        Bucket: config.s3BucketName,
        CopySource: `${config.s3BucketName}/${key}`,
        Key: newKey,
      })
    );
    return newKey;
  },
  moveToPrivate: async (key: string) => {
    if (!key.startsWith("public/")) {
      return key;
    }
    const newKey = key.replace("public/", "");
    await config.s3Client.send(
      new CopyObjectCommand({
        Bucket: config.s3BucketName,
        CopySource: `${config.s3BucketName}/${key}`,
        Key: newKey,
      })
    );
    return newKey;
  },
};

function generateKey(isPublic: boolean) {
  return normalize(`${isPublic ? "public/" : ""}${generateRandomFilename()}`);
}

function generateRandomFilename() {
  return crypto.getRandomValues(new Uint32Array(4)).join("").toString();
}

async function createPresignedUrl(key: string) {
  return getSignedUrl(
    config.s3Client,
    new GetObjectCommand({
      Bucket: config.s3BucketName,
      Key: key,
    }),
    { expiresIn: 15 * 60 } // 15 minutes
  );
}

async function resizeImage(buffer: Buffer) {
  return sharp(buffer)
    .resize({ width: 1920, height: 1080, fit: "cover" })
    .toBuffer();
}

function normalizeUrl(url: string) {
  const urlObj = new URL(url);
  return urlObj.href;
}
