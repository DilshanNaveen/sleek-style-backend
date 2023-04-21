import { Handler } from "aws-lambda";
import { getBooleanResponse, getErrorResponse } from "sleek-style-util/dist/utils/responseUtil";
import { updateUserData } from "sleek-style-util/dist/utils/userUtils";

type queryStringParameters = {
  id: string;
};

export const post: Handler = async (event: any) => {
  try {
    const { id }: queryStringParameters = event.queryStringParameters;
    const feedback = JSON.parse(event.body);
    console.log("feedback", feedback);
    await updateUserData(id, { feedback });
    return getBooleanResponse(true);
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error.message);
  }
};
