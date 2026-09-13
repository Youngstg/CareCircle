import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type MinioConfig = {
  bucket: string;
  client: S3Client;
};

let cachedConfig: MinioConfig | undefined;

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Konfigurasi storage tidak lengkap: ${name} wajib diisi.`);
  }
  return value;
}

function parseSslSetting(): boolean {
  const value = process.env.MINIO_USE_SSL?.trim().toLowerCase();
  if (!value || value === "false" || value === "0") return false;
  if (value === "true" || value === "1") return true;
  throw new Error("Konfigurasi storage tidak valid: MINIO_USE_SSL harus true atau false.");
}

function endpointUrl(endpoint: string, ssl: boolean): string {
  const withoutProtocol = endpoint.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  if (!withoutProtocol) {
    throw new Error("Konfigurasi storage tidak valid: MINIO_ENDPOINT kosong.");
  }
  return `${ssl ? "https" : "http"}://${withoutProtocol}`;
}

function getMinioConfig(): MinioConfig {
  if (cachedConfig) return cachedConfig;

  const accessKeyId = requiredEnvironment("MINIO_ACCESS_KEY");
  const secretAccessKey = requiredEnvironment("MINIO_SECRET_KEY");
  const bucket = requiredEnvironment("MINIO_BUCKET");
  const endpoint = endpointUrl(requiredEnvironment("MINIO_ENDPOINT"), parseSslSetting());
  const region = process.env.MINIO_REGION?.trim() || "us-east-1";

  cachedConfig = {
    bucket,
    client: new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    }),
  };
  return cachedConfig;
}

export async function putPrivateObject(input: {
  objectKey: string;
  body: Uint8Array;
  contentType: string;
}): Promise<void> {
  const { bucket, client } = getMinioConfig();
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: input.objectKey,
    Body: input.body,
    ContentType: input.contentType,
    ACL: "private",
  }));
}

export async function deletePrivateObject(objectKey: string): Promise<void> {
  const { bucket, client } = getMinioConfig();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
}

export async function createPrivateDocumentUrl(input: {
  objectKey: string;
  originalName: string;
  disposition: "inline" | "attachment";
}): Promise<string> {
  const { bucket, client } = getMinioConfig();
  const safeFileName = input.originalName.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 180) || "dokumen";
  return getSignedUrl(client, new GetObjectCommand({
    Bucket: bucket,
    Key: input.objectKey,
    ResponseContentDisposition: `${input.disposition}; filename="${safeFileName}"`,
  }), { expiresIn: 60 });
}
