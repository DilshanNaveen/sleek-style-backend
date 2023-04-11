import { Handler } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { dynamoDBQuery } from "./utils/dbUtils";
import { S3_METHODS, getPreSignedUrl } from "./utils/s3Utils";
import { HairstyleSuggestion } from "./types/hairstyle";
import axios from "axios";

type queryStringParameters = {
  id: string;
  appearanceImageId: string;
}

export const get: Handler = async (event: any) => {
  try {
    const { id, appearanceImageId }: queryStringParameters = event.queryStringParameters;
    const [userData] = await dynamoDBQuery(process.env.DYNAMODB_TABLE_USER_DATA, "id", id);
    console.log("userData :", userData);
    const appearanceImageKey: string = userData.suggestedHairstyles.find((item: HairstyleSuggestion) => item.id === appearanceImageId)?.key;
    console.log("appearanceImageKey :", appearanceImageKey);
    const identityImage = await getPreSignedUrl(process.env.S3_BUCKET_USER_DATA, userData.image, S3_METHODS.get, undefined, 900);
    const appearanceImage = await getPreSignedUrl(process.env.S3_BUCKET_HAIRSTYLE_SUGGESTIONS, appearanceImageKey, S3_METHODS.get, undefined, 900);

    const data = {
      version: "281b67c433c57ad1901593e12a34fd945a0d52d198642af8f046a2c177d4b813",
      input: {
        identity_image: identityImage,
        appearance_image: appearanceImage,
      }
    }

    console.log("identityImage : ", identityImage);
    console.log("appearanceImage : ", appearanceImage);

    const result = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.REPLICATE_API_URL as string,
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN as string}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    });

    console.log("result : ", result.data);

    return getSuccessResponse({
      status: result.data.status,
      identityImage: identityImage,
      appearanceImage: appearanceImage,
      id: result.data.id,
    });
  } catch (error) {
    console.log('error message :', error);
    getErrorResponse(error.message);
  }
};
