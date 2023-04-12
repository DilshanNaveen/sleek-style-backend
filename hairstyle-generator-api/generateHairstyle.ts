import { Handler } from "aws-lambda";
import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";
import { S3_METHODS, getPreSignedUrl } from "./utils/s3Utils";
import { HairstyleSuggestion } from "./types/hairstyle";
import axios from "axios";
import { UserDataStatus } from "./types/userData";
import { getUserData, saveUserImageData, updateUserData } from "./utils/userUtils";

type queryStringParameters = {
  id: string;
  appearanceImageId: string;
};

const triggerReplicate = async (id: string, identityImage: string, appearanceImage: string) => {
  const data = {
    version: process.env.MODEL_VERSION as string,
    input: {
      identity_image: identityImage,
      appearance_image: appearanceImage,
    },
    webhook: `${process.env.WEBHOOK_URL as string}?id=${id}`,
    webhook_events_filter: ["completed"]
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

  return result.data;
};

export const get: Handler = async (event: any) => {
  try {
    const { id, appearanceImageId }: queryStringParameters = event.queryStringParameters;
    const userData = await getUserData(id);
    console.log("userData :", userData);
    const appearanceImageKey: string = userData.suggestedHairstyles
      .find((item: HairstyleSuggestion) => item.id === appearanceImageId)?.key;
    console.log("appearanceImageKey :", appearanceImageKey);

    const identityImage = await getPreSignedUrl(process.env.S3_BUCKET_USER_DATA, userData.image, S3_METHODS.get, undefined, 1800);
    const appearanceImage = await getPreSignedUrl(process.env.S3_BUCKET_HAIRSTYLE_SUGGESTIONS, appearanceImageKey, S3_METHODS.get, undefined, 1800);
    const triggerResponse = await triggerReplicate(id, identityImage, appearanceImage);

    console.log("result :", triggerResponse);

    console.log("Saving user input images...")
    await saveUserImageData(`${id}/identity_image.png`, identityImage);
    await saveUserImageData(`${id}/appearance_image.png`, appearanceImage);
    console.log("Saved user input images.");
    
    console.log("Saving user data...");
    await updateUserData(id, {
      input: {
        identity_image: userData.image,
        appearance_image: appearanceImage,
      },
      status: UserDataStatus.START_GENERATING_HAIRSTYLE,
    });
    console.log("Saved user data.");

    return getSuccessResponse({
      status: triggerResponse.status,
      identityImage: identityImage,
      appearanceImage: appearanceImage,
      id: triggerResponse.id,
    });
  } catch (error) {
    console.log('error message :', error);
    getErrorResponse(error.message);
  }
};
