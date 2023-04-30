import { Handler } from "aws-lambda";
import { UserDataStatus } from "sleek-style-util/dist/types/userData";
import { putObject } from "sleek-style-util/dist/utils/s3Utils";
import { saveUserImageData, updateUserData } from "sleek-style-util/dist/utils/userUtils";

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
    if (process.env.S3_BUCKET_USER_DATA === undefined) throw new Error("S3_BUCKET_USER_DATA is undefined.");
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
      generatedHairstyle: `${id}/generated_image.png`,
      status: UserDataStatus.HAIRSTYLE_GENERATED,
    });
    console.log("Saved user data.");
    callback(null, { statusCode: 200, body: "Success" });
  } catch (error) {
    callback(null, { statusCode: 500, body: "Error" });
  }
};
