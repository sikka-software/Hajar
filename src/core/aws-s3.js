import AWS from "aws-sdk";

export function initializeS3() {
  const config = {
    accessKeyId: global._config.accessKeyId,
    secretAccessKey: global._config.secretAccessKey,
    Bucket: global._config.Bucket,
  };
  return new AWS.S3(config);
}

export async function listImages(params, callback) {
  initializeS3().listObjects(params, function (err, data) {
    callback(err, data);
  });
}

export async function uploadImage(
  params,
  CallbackhttpUploadProgress,
  CallbackSend
) {
  initializeS3()
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      CallbackhttpUploadProgress(evt);
    })
    .send((err, data) => {
      CallbackSend(err, data);
    });
}

export async function deleteImage(params, callback) {
  initializeS3().deleteObject(params, function (err, data) {
    callback(err, data);
  });
}

export async function deleteImages(params, callback, e) {
  try {
    const deleted = await initializeS3().deleteObjects(params).promise();
    callback(deleted, e);
  } catch (error) {
    callback(error, e);
  }
}
