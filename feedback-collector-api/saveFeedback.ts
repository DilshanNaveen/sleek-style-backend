import { Handler } from "aws-lambda";
import { Feedback } from "sleek-style-util/dist/types/userData";
import { getBooleanResponse, getErrorResponse } from "sleek-style-util/dist/utils/responseUtil";
import { updateUserData } from "sleek-style-util/dist/utils/userUtils";

type queryStringParameters = {
  id: string;
};

export const post: Handler = async (event: any) => {
  try {
    const { id }: queryStringParameters = event.queryStringParameters;
    const feedback: Feedback = JSON.parse(event.body);
    console.log("feedback", feedback);
    await updateUserData(id, { feedback });
    return getBooleanResponse(true);
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error.message);
  }
};
