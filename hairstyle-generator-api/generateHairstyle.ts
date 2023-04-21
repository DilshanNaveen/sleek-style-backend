import { Handler } from "aws-lambda";
import axios from "axios";
import { HairstyleSuggestion } from "sleek-style-util/dist/types/hairstyle";
import { UserData, UserDataStatus } from "sleek-style-util/dist/types/userData";
import { getBooleanResponse, getErrorResponse } from "sleek-style-util/dist/utils/responseUtil";
import { putObject, getPreSignedUrl, S3_METHODS } from "sleek-style-util/dist/utils/s3Utils";
import { saveUserImageData, updateUserData, getUserData } from "sleek-style-util/dist/utils/userUtils";

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

const validateUserData = async (userData: UserData, appearanceImageId: string): Promise<{ appearanceImageKey: string, userImage: string }> => {
  if (!userData.suggestedHairstyles || !userData.image) {
    throw new Error("Suggested hairstyles or user's Image not found in userData");
  }

  const appearanceImageKey: string | undefined = userData.suggestedHairstyles
    .find((item: HairstyleSuggestion) => item.id === appearanceImageId)?.key;

  if (!appearanceImageKey) {
    throw new Error('Appearance image key not found');
  }

  return { appearanceImageKey, userImage: userData.image };
}

const saveLog = async (id: string, log: any) => {
  console.log("saving log :", log);
  await putObject(
    process.env.S3_BUCKET_USER_DATA,
    `${id}/log/${log?.status || "error"}_log.json`,
    JSON.stringify(log),
    "application/json"
  );
}

const saveUserImages = async (id: string, identityImage: string, appearanceImage: string) => {
  console.log("Saving user input images...");
  await saveUserImageData(`${id}/identity_image.png`, identityImage);
  await saveUserImageData(`${id}/appearance_image.png`, appearanceImage);
  console.log("Saved user input images.");
}

const saveUpdatedUserData = async (id: string, userData: UserData, appearanceImage: string, logId: string) => {
  console.log("Saving user data...");
  await updateUserData(id, {
    input: {
      identity_image: userData.image,
      appearance_image: appearanceImage,
    },
    status: UserDataStatus.START_GENERATING_HAIRSTYLE,
    generatorId: logId,
  });
  console.log("Saved user data.");
}

export const get: Handler = async (event: any) => {
  try {
    const { id, appearanceImageId }: queryStringParameters = event.queryStringParameters;
    const userData: UserData = await getUserData(id);
    console.log("userData :", userData);

    const { appearanceImageKey, userImage } = await validateUserData(userData, appearanceImageId);
    console.log("appearanceImageKey :", appearanceImageKey);

    const identityImage = await getPreSignedUrl(process.env.S3_BUCKET_USER_DATA, userImage, S3_METHODS.get, undefined, 1800);
    const appearanceImage = await getPreSignedUrl(process.env.S3_BUCKET_HAIRSTYLE_SUGGESTIONS, appearanceImageKey, S3_METHODS.get, undefined, 1800);
    const log = await triggerReplicate(id, identityImage, appearanceImage);

    await saveLog(id, log);
    await saveUserImages(id, identityImage, appearanceImage);
    await saveUpdatedUserData(id, userData, appearanceImage, log.id);

    return getBooleanResponse(true);
  } catch (error) {
    console.log('error message :', error);
    return getErrorResponse(error.message);
  }
};
