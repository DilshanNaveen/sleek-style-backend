import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";

export const hello = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return getSuccessResponse({ status: "SUCCESS 1", Test: `${process.env.S3_BUCKET_USER_DATA}` });
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
