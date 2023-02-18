import { UserData, CustomizationSettings, UserDataStatus } from "./types/userData";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { getPreSignedUrl, S3_METHODS } from "./utils/s3Utils";
import { Handler } from "aws-lambda";
import { dynamoDBPutItem } from './utils/dbUtils';
import { getUUID } from './utils/userUtil';

const saveUserData = async (customizationSettings: CustomizationSettings) => {
  const payload: UserData = {
    id: await getUUID(),
    date: new Date(),
    status: UserDataStatus.WAITING_FOR_IMAGE,
    customizationSettings: customizationSettings,
    lastModifiedDate: new Date()
  }
  await dynamoDBPutItem(process.env.DYNAMODB_TABLE_USER_DATA, payload);
  return payload.id;
}

export const post: Handler = async (event: any) => {
  try {
    const { key, contentType }: any = event.queryStringParameters;
    const eventBody: CustomizationSettings = JSON.parse(event.body);
    const url = await getPreSignedUrl(process.env.S3_BUCKET_USER_DATA, key, S3_METHODS.put, contentType);
    const id = await saveUserData(eventBody);
    return getSuccessResponse({ body: { url, id } });
  } catch (error) {
    console.log('error :', error);
    getErrorResponse(error.message);
  }
};
