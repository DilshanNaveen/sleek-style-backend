import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import axios from 'axios';

export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const result = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
    return getSuccessResponse({ status: "SUCCESS", Test: `${process.env.S3_BUCKET_USER_DATA}`, result });
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
