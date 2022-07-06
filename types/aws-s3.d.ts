import AWS from 'aws-sdk';
declare type callbackUploadImage = (response: AWS.S3.PutObjectOutput, e: any) => void;
declare type callbackDeleteImage = (response: AWS.S3.DeleteObjectOutput, e: any) => void;
declare type callbackDeleteImages = (response: AWS.S3.DeleteObjectsOutput, e: any) => void;
export declare function initializeS3(): AWS.S3;
export declare function uploadImage(params: AWS.S3.PutObjectRequest, callback: callbackUploadImage, e: any): Promise<void>;
export declare function deleteImage(params: AWS.S3.DeleteObjectRequest, callback: callbackDeleteImage, e: any): Promise<void>;
export declare function deleteImages(params: AWS.S3.DeleteObjectsRequest, callback: callbackDeleteImages, e: any): Promise<void>;
export {};
//# sourceMappingURL=aws-s3.d.ts.map