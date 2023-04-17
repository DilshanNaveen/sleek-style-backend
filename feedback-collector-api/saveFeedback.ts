import { Handler } from "aws-lambda";
import { getErrorResponse, getSuccessResponse } from './utils/responseUtil';

export const post: Handler = async (event: any) => {
  try {
    const feedback = JSON.parse(event.body);
    console.log("feedback", feedback);
    return getSuccessResponse(feedback);
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error.message);
  }
};
