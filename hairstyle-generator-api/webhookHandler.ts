import { Handler } from "aws-lambda";
import { UserDataStatus } from "./types/userData";
import { saveUserImageData, updateUserData } from "./utils/userUtils";
import { putObject } from "./utils/s3Utils";

type queryStringParameters = {
  id: string;
};

export const post: Handler = async (event: any, _, callback: any) => {
  try {
    const { id }: queryStringParameters = event.queryStringParameters;
    console.log("received event :", event);
    const { output, status } = JSON.parse(event.body);
    console.log("output :", output);
    console.log("Saving log...");
    await putObject(
      process.env.S3_BUCKET_USER_DATA,
      `${id}/log/${status || "error"}_log.json`,
      event.body,
      "application/json"
    );
    console.log("Saved log.");
    console.log("Saving generated image...");
    await saveUserImageData(`${id}/generated_image.png`, output);
    console.log("Saved generated image.");
    console.log("output :", output);
    console.log("Saving user data...");
    await updateUserData(id, {
      generatedImage: `${id}/generated_image.png`,
      status: UserDataStatus.HAIRSTYLE_GENERATED,
    });
    console.log("Saved user data.");
    callback(null, { statusCode: 200, body: "Success" });
  } catch (error) {
    callback(null, { statusCode: 500, body: "Error" });
  }
};
