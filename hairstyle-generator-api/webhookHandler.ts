import { Handler } from "aws-lambda";
import axios from "axios";
import { dynamoDBUpdateItem } from "./utils/dbUtils";
import { UserDataStatus } from "./types/userData";
import { putObject } from "./utils/s3Utils";

type queryStringParameters = {
  id: string;
};

const saveUserData = async (id: string, userData: any) =>
  dynamoDBUpdateItem(
    process.env.DYNAMODB_TABLE_USER_DATA,
    "id",
    id,
    undefined,
    undefined,
    userData
  );

const saveGeneratedImage = async (id: string, imageUrl: string) => {
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  console.log("imageResponse :", imageResponse);
  const imageData = imageResponse.data;
  console.log("imageData :", imageData);

  await putObject(
    process.env.S3_BUCKET_USER_DATA,
    `${id}/generated_image.png`,
    imageData
  );
};

export const post: Handler = async (event: any, _, callback: any) => {
  try {
    const { id }: queryStringParameters = event.queryStringParameters;
    const { output } = JSON.parse(event.body);
    console.log("Saving generated image...");
    await saveGeneratedImage(id, output);
    console.log("Saved generated image.");
    console.log("output :", output);
    console.log("Saving user data...");
    await saveUserData(id, {
      generatedImage: `${id}/generated_image.png`,
      lastModifiedDate: new Date().toISOString(),
      status: UserDataStatus.HAIRSTYLE_GENERATED,
    });
    console.log("Saved user data.");
    callback(null, {});
  } catch (error) {
    console.log("error message :", error);
    callback(null, {});
  }
};
