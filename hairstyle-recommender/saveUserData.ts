import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { getPreSignedUrl, S3_METHODS } from "./utils/s3Utils";
import { Handler } from "aws-lambda";

export const post: Handler = async (event: any) => {
  try {
    const { key, contentType }: any = event.queryStringParameters;
    const url = await getPreSignedUrl(process.env.S3_BUCKET_USER_DATA, key, S3_METHODS.put, contentType);
    console.log("url :", url);
    return getSuccessResponse({ body: url });
  } catch (error) {
    console.log('error :', error);
    getErrorResponse(error.message);
  }
};
