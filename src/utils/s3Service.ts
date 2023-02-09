import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuid } from "uuid";
import fs from "fs";

const s3Upload = async (file: any) => {
  const s3 = new S3Client({
    region: process.env.CUSTOM_AWS_REGION,
    credentials: {
      accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
    },
  });

  const fileStream = fs.createReadStream(file.filepath);
  let imgKey = `${uuid()}-${file.originalFilename}`;
  if (
    file.originalFilename?.includes(".jpg") ||
    file.originalFilename?.includes(".png") ||
    file.originalFilename?.includes(".jpeg") ||
    file.originalFilename?.includes(".gif") ||
    file.originalFilename?.includes(".webp") ||
    file.originalFilename?.includes(".svg")
  ) {
    imgKey += "";
  } else {
    imgKey += file.extension;
  }
  const params = {
    Bucket: process.env.CUSTOM_AWS_BUCKET_NAME,
    Key: imgKey,
    Body: fileStream,
  };

  const parallelUploads3 = new Upload({
    client: s3,
    queueSize: 4, // optional concurrency configuration
    leavePartsOnError: false, // optional manually handle dropped parts
    params,
  });

  parallelUploads3.on("httpUploadProgress", (progress) => {
    console.log(progress);
  });

  return new Promise((resolve, reject) => {
    parallelUploads3
      .done()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const s3MetadataUpload = async (file: any) => {
  const s3 = new S3Client({
    region: process.env.CUSTOM_AWS_REGION,
    credentials: {
      accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.CUSTOM_AWS_BUCKET_NAME,
    Key: `${uuid()}.json`,
    Body: file,
    ContentEncoding: "base64",
    ContentType: "application/json",
  };
  const command = new PutObjectCommand(params);
  return new Promise((resolve, reject) => {
    s3.send(command, (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      }
    });
  });
};

export { s3Upload, s3MetadataUpload };
