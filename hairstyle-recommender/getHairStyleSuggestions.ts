import { Handler } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";

export const get: Handler = async (event: any) => {
    try {
      const { id }: any = event.queryStringParameters;
      return getSuccessResponse({ body: { id } });
    } catch (error) {
      console.log('error :', error);
      getErrorResponse(error.message);
    }
  };