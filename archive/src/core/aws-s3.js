const _config = {
  accessKeyId: "<ACCESS_KEY_ID>",
  secretAccessKey: "<SECRET_ACCESS_KEY>",
  Bucket: "<BUCKET_NAME>",
};
const AWS = require("aws-sdk");
global._config = _config;
async function initializeS3() {
  const config = {
    accessKeyId: global._config.accessKeyId,
    secretAccessKey: global._config.secretAccessKey,
    Bucket: global._config.Bucket,
  };
  return new AWS.S3(config);
}
async function listImages(params, callback) {
  initializeS3().listObjects(params, function (err, data) {
    if (err) {
      callback(err, null);
    }
    const images = data.Contents.filter(
      (item) =>
        item.Key.endsWith(".jpg") ||
        item.Key.endsWith(".jpeg") ||
        item.Key.endsWith(".png")
    );
    return callback(null, images);
  });
}

async function uploadImage(params, CallbackhttpUploadProgress, CallbackSend) {
  initializeS3()
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      CallbackhttpUploadProgress(evt);
    })
    .send((err, data) => {
      CallbackSend(err, data);
    });
}

async function deleteImage(params, callback) {
  initializeS3().deleteObject(params, function (err, data) {
    callback(err, data);
  });
}

async function deleteImages(params, callback, e) {
  try {
    const deleted = await initializeS3().deleteObjects(params).promise();
    callback(deleted, e);
  } catch (error) {
    callback(error, e);
  }
}
module.exports = {
  initializeS3,
  listImages,
  uploadImage,
  deleteImage,
  deleteImages,
};
