import { Handler } from "aws-lambda";
import { Feedback, UserData } from "sleek-style-util/dist/types/userData";
import { parseBoolean } from "sleek-style-util/dist/utils/commonUtils";
import { getBooleanResponse, getErrorResponse } from "sleek-style-util/dist/utils/responseUtil";
import { deleteFiles } from "sleek-style-util/dist/utils/s3Utils";
import { getUserData, updateUserData } from 'sleek-style-util/dist/utils/userUtils';

type queryStringParameters = {
  id: string;
  saveData: boolean
};

const flag: string = "DELETED_BY_THE_USER";

const deleteSensitiveData = async (id: string) => {
  console.log("Deleting sensitive data...");
  const { image, input, generatedHairstyle }: UserData = await getUserData(id);
  const { appearance_image, identity_image }: any = input;
  const sensitiveData: string[] = [image, appearance_image, identity_image, generatedHairstyle ];
  console.log("sensitiveData", sensitiveData);
  deleteFiles(process.env.S3_BUCKET_USER_DATA as string, sensitiveData);
  console.log("sensitive data deleted from S3");
  return { image: flag, input: { appearance_image: flag, identity_image: flag }, generatedHairstyle: flag };
};

const validateQueryStringParameters = (params: queryStringParameters) => {
  if (!params.id || typeof params.id !== "string") {
    throw new Error("Invalid 'id' parameter");
  }
  if (params.saveData !== undefined && typeof Boolean(params.saveData) !== "boolean") {
    throw new Error("Invalid 'saveData' parameter");
  }
  console.log("params", params);
  return { id: params.id, saveData: parseBoolean(String(params.saveData)) };
};

export const post: Handler = async (event: any) => {
  try {
    const { id, saveData } = validateQueryStringParameters(event.queryStringParameters);

    let sensitiveData = {};
    if (!saveData) {
      console.log("saveData is false")
      sensitiveData = await deleteSensitiveData(id);
    }
    const feedback: Feedback = JSON.parse(event.body);
    console.log("feedback", feedback);
    console.log("sensitiveData ", sensitiveData);
    await updateUserData(id, { feedback, ...sensitiveData });
    return getBooleanResponse(true);
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error.message);
  }
};
