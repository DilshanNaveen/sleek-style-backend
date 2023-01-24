import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getErrorResponse, getSuccessResponse } from "../utils/responseUtil";

export const hello = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return getSuccessResponse({ status: "SUCCESS" });
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
