import { UserData, CustomizationSettings, UserDataStatus } from "./types/userData";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { getPreSignedUrl, S3_METHODS } from "./utils/s3Utils";
import { Handler } from "aws-lambda";
import { dynamoDBPutItem } from './utils/dbUtils';
const { v4: uuidv4 } = require('uuid');

const saveUserData = async (id: string, fileName: string, customizationSettings: CustomizationSettings) => {
  const payload: UserData = {
    id: id,
    date: new Date().toISOString(),
    image: fileName,
    status: UserDataStatus.WAITING_FOR_IMAGE,
    customizationSettings: customizationSettings,
    lastModifiedDate: new Date().toISOString()
  }
  await dynamoDBPutItem(process.env.DYNAMODB_TABLE_USER_DATA, payload);
  return payload.id;
}

export const post: Handler = async (event: any) => {
  try {
    const { contentType }: any = event.queryStringParameters;
    const eventBody: CustomizationSettings = JSON.parse(event.body);
    const id = uuidv4();
    const fileName = `${id}.${contentType.split('/')[1]}`;
    const url = await getPreSignedUrl(process.env.S3_BUCKET_USER_DATA, fileName, S3_METHODS.put, contentType);
    await saveUserData(id, fileName, eventBody);
    return getSuccessResponse({ body: { url, id } });
  } catch (error) {
    console.log('error :', error);
    getErrorResponse(error.message);
  }
};
