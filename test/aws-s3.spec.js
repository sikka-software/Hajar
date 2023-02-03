import AWS from "aws-sdk";
import Hajar from "../src/index";

describe("initializeS3", () => {
  it("creates an instance of the S3 client", () => {
    const s3 = Hajar.S3.InitializeS3();
    expect(s3).toBeInstanceOf(AWS.S3);
  });
});
