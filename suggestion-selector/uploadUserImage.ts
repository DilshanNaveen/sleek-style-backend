import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { S3_METHODS } from "./utils/s3Utils";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3"

export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const s3 = new S3Client("ap-southeast-1");
    const { key, contentType = undefined, method = S3_METHODS.get }: any = event.queryStringParameters;

    // Set the parameters
    const params = {
      Bucket: process.env.S3_BUCKET_USER_DATA, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: "sample_upload.txt", // The name of the object. For example, 'sample_upload.txt'.
      Body: "Test", // The content of the object. For example, 'Hello world!".
    };

    console.log("params :", params);

    const results = await s3.send(new PutObjectCommand(params));

    console.log("received queryStringParameters: ", key, contentType, method);
    // const url = await getSignedUrl(process.env.S3_BUCKET_USER_DATA, key, method, contentType);
    // console.log("url :", url);
    return getSuccessResponse({ body: { results } });
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
