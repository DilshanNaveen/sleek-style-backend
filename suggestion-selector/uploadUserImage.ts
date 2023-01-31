import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { S3_METHODS } from "./utils/s3Utils";

const AWS = require('aws-sdk');


export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { key, contentType = undefined }: any = event.queryStringParameters;
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});

    var params: any = {
      Bucket: process.env.S3_BUCKET_USER_DATA,
      Key: key,
      Expires: 300,
    };
    if (contentType) {
        params.ContentType = contentType;
    }

    const url = await s3.getSignedUrl(S3_METHODS.put, params);

    console.log("received queryStringParameters: ", key, contentType);
    // const url = await getSignedUrl(process.env.S3_BUCKET_USER_DATA, key, method, contentType);
    // console.log("url :", url);
    return getSuccessResponse({ body: { url } });
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
