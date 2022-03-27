import AWS from "aws-sdk";

export default function s3() {
    let config: AWS.ConfigurationOptions = {
        accessKeyId: globalThis.__config.accessKeyId,
        secretAccessKey: globalThis.__config.secretAccessKey,
    };
    return new AWS.S3(config);
}