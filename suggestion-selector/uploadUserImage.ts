import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { S3_METHODS, getSignedUrl } from "./utils/s3Utils";

export const get = async (event: APIGatewayProxyEvent | any): Promise<APIGatewayProxyResult> => {
  try {
    const { key, contentType = undefined, method = S3_METHODS.get }: any = event.queryStringParameters;
    console.log("body = ", event.body);
    const formData = new FormData(event.body);
    console.log("formData :", formData);
    // const fileType = body.query['file-type'];
    // console.log("fileType :", fileType);
    const url = await getSignedUrl(process.env.S3_BUCKET_USER_DATA, key, method, contentType);
    return getSuccessResponse({ body: { url } });
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
