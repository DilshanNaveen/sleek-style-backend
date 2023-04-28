import { Handler } from "aws-lambda";
import axios from "axios";
import FormData from "form-data";
import { HairstyleSuggestion, HairstyleSuggestionResolvedPromise, HairstyleSuggestionResponse } from "sleek-style-util/dist/types/hairstyle";
import { UserData, UserDataStatus, Gender } from "sleek-style-util/dist/types/userData";
import { dynamoDBPutItem } from "sleek-style-util/dist/utils/dbUtils";
import { getSuccessResponse, getErrorResponse } from "sleek-style-util/dist/utils/responseUtil";
import { getObject, getSuggestions, getPreSignedUrl } from "sleek-style-util/dist/utils/s3Utils";
import { getUserData } from "sleek-style-util/dist/utils/userUtils";
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
  if (!process.env.DYNAMODB_TABLE_USER_DATA) throw new Error("DynamoDB table not found");
  await dynamoDBPutItem(process.env.DYNAMODB_TABLE_USER_DATA, payload);
}

const predictFaceShape = async (gender: Gender, key: string) => {
  if (!process.env.S3_BUCKET_USER_DATA) throw new Error("S3 Bucket not found");
  const res = await getObject(process.env.S3_BUCKET_USER_DATA, key);
  // // Convert file to FormData
  const formData = new FormData();
  formData.append('file', res.Body, key);
  // // Set Content-Type header based on file type
  const contentType = 'image/png';
  formData.append('Content-Type', contentType);
  const url: string | undefined = gender === Gender.MALE ? process.env.FACE_SHAPE_PREDICTOR_MALE_API : process.env.FACE_SHAPE_PREDICTOR_FEMALE_API;
  if (!url) throw new Error("Face shape predictor API not found");
  const result = await axios.post(url, formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
  });
  return result.data.face_shape;
};

export const get: Handler = async (event: any) => {
  try {
    const { id, limit = 5 }: queryStringParameters = event.queryStringParameters;
    const userData = await getUserData(id);
    console.log("userData :", userData);
    if (!userData.image) throw new Error("User image not found");
    const faceShape = await predictFaceShape(userData.customizationSettings.gender, userData.image);
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
    const userImage: string = await getPreSignedUrl(process.env.S3_BUCKET_USER_DATA, userData.image);

    await saveUserData(userData, faceShape, suggestions);

    return getSuccessResponse({ body: { userImage, suggestions: response } });
  } catch (error) {
    console.log('error message :', error);
    return getErrorResponse(error.message);
  }
};
