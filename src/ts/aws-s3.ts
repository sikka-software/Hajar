import AWS from 'aws-sdk'

type callbackUploadImage = (response: AWS.S3.PutObjectOutput, e: any) => void
type callbackDeleteImage = (response: AWS.S3.DeleteObjectOutput, e: any) => void
type callbackDeleteImages = (response: AWS.S3.DeleteObjectsOutput, e: any) => void

export default function initializeS3 () {
  const config: AWS.ConfigurationOptions = {
    accessKeyId: globalThis._config.accessKeyId,
    secretAccessKey: globalThis._config.secretAccessKey
  }
  return new AWS.S3(config)
}

export async function uploadImage (params: AWS.S3.PutObjectRequest, callback: callbackUploadImage, e: any): Promise<void> {
  try {
    const stored = await initializeS3().putObject(params).promise()
    callback(stored, e)
  } catch (error: any) {
    callback(error, e)
  }
}

export async function deleteImage (params: AWS.S3.DeleteObjectRequest, callback: callbackDeleteImage, e: any): Promise<void> {
  try {
    const deleted = await initializeS3().deleteObject(params).promise()
    callback(deleted, e)
  } catch (error: any) {
    callback(error, e)
  }
}

export async function deleteImages (params: AWS.S3.DeleteObjectsRequest, callback: callbackDeleteImages, e: any): Promise<void> {
  try {
    const deleted = await initializeS3().deleteObjects(params).promise()
    callback(deleted, e)
  } catch (error: any) {
    callback(error, e)
  }
}
