import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { S3_METHODS, getSignedUrl } from "./utils/s3Utils";

export const get = async (event: APIGatewayProxyEvent | any): Promise<APIGatewayProxyResult> => {
  try {
    const { key, contentType = undefined, method = S3_METHODS.get }: any = event.queryStringParameters;
    const file = Buffer.from(event.body, "base64");
    // const fileType = body.query['file-type'];
    // console.log("fileType :", fileType);
    console.log("file :", file);
    const url = await getSignedUrl(process.env.S3_BUCKET_USER_DATA, key, method, contentType);
    return getSuccessResponse({ body: { url } });
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
