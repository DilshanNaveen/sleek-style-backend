import { Handler } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { dynamoDBPutItem, dynamoDBQuery } from "./utils/dbUtils";
import { getObject, getPreSignedUrl, getSuggestions } from "./utils/s3Utils";
import { HairstyleSuggestion, HairstyleSuggestionResolvedPromise, HairstyleSuggestionResponse } from "./types/hairstyle";
import { UserData, UserDataStatus } from "./types/userData";
import axios from "axios";
import FormData from "form-data";
const { v4: uuidv4 } = require('uuid');

type queryStringParameters = {
  id: string;
  faceShape: string;
  limit?: number;
}

const saveUserData = async (userData: UserData, faceShape: string, suggestions: HairstyleSuggestion[]) => {
  const payload: UserData = {
    ...userData,
    status: UserDataStatus.HAIRSTYLE_SUGGESTED,
    faceShape,
    suggestedHairstyles: suggestions,
    lastModifiedDate: new Date().toISOString()
  }
  await dynamoDBPutItem(process.env.DYNAMODB_TABLE_USER_DATA, payload);
}

const predictFaceShape = async (key: string) => {
  const res = await getObject(process.env.S3_BUCKET_USER_DATA, key);
  // // Convert file to FormData
  const formData = new FormData();
  formData.append('file', res.Body, key);
  // // Set Content-Type header based on file type
  const contentType = 'image/png'; // Change as necessary
  formData.append('Content-Type', contentType);
  const result = await axios.post(process.env.FACE_SHAPE_PREDICTOR_API as string, formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
  });
  return result.data.face_shape;
};

export const get: Handler = async (event: any) => {
  try {
    const { id, limit = 5 }: queryStringParameters = event.queryStringParameters;
    const [userData] = await dynamoDBQuery(process.env.DYNAMODB_TABLE_USER_DATA, "id", id);
    console.log("userData :", userData);
    const faceShape = await predictFaceShape(userData.image);
    console.log(faceShape);
    const { Contents } = await getSuggestions(userData.customizationSettings, faceShape, limit);
    const promises = Contents.map(async (item) => {
      const signedUrl = await getPreSignedUrl(process.env.S3_BUCKET_HAIRSTYLE_SUGGESTIONS, item.Key);
      return { id: uuidv4(), key: item.Key, url: signedUrl };
    });

    // mapped resolved promises to HairstyleSuggestion and HairstyleSuggestionResponse
    const resolvedPromises: HairstyleSuggestionResolvedPromise[] = await Promise.all(promises);
    const suggestions: HairstyleSuggestion[] = resolvedPromises.map(({ id, key }: HairstyleSuggestionResolvedPromise) => ({ id, key }));
    const response: HairstyleSuggestionResponse[] = resolvedPromises.map(({ id, url }: HairstyleSuggestionResolvedPromise) => ({ id, url }));

    await saveUserData(userData, faceShape, suggestions);

    return getSuccessResponse({ body: response });
  } catch (error) {
    console.log('error message :', error);
    return getErrorResponse(error.message);
  }
};
