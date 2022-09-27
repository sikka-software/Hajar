import AWS from "aws-sdk";

export function initializeS3 () {
  const config = {
    accessKeyId: global._config.accessKeyId,
    secretAccessKey: global._config.secretAccessKey,
    Bucket: global._config.Bucket
  };
  return new AWS.S3(config);
}

/* tslint:disable:no-string-literal */
export async function uploadImage (params, callback, e){
  try {
    const stored = await initializeS3().putObject(params).promise();
    callback(stored, e);
  } catch (error) {
    callback(error, e);
  }
}

export async function deleteImage (params, callback, e){
  try {
    const deleted = await initializeS3().deleteObject(params).promise();
    callback(deleted, e);
  } catch (error) {
    callback(error, e);
  }
}

export async function deleteImages (params, callback, e){
  try {
    const deleted = await initializeS3().deleteObjects(params).promise();
    callback(deleted, e);
  } catch (error) {
    callback(error, e);
  }
}