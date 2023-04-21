import { Handler } from "aws-lambda";
import axios from "axios";
import { UserDataStatus } from "sleek-style-util/dist/types/userData";
import { getBooleanResponse, getErrorResponse } from "sleek-style-util/dist/utils/responseUtil";
import { putObject } from "sleek-style-util/dist/utils/s3Utils";
import { getUserData, updateUserData } from "sleek-style-util/dist/utils/userUtils";

type queryStringParameters = {
  id: string;
};

const cancelGeneratorModel = async (id: string) => {
  const { generatorId } = await getUserData(id);
  if (!process.env.REPLICATE_API_URL) throw new Error("REPLICATE_API_URL is not defined.");
  const result = await axios({
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.REPLICATE_API_URL as string}/${generatorId}/cancel`,
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN as string}`,
      "Content-Type": "application/json",
    },
  });

  return result.data;
};

export const get: Handler = async (event: any) => {
  try {
    const { id }: queryStringParameters = event.queryStringParameters;
    console.log("received event :", event);
    const log = await cancelGeneratorModel(id);
    console.log("Saving log... :", log);
    if (!process.env.S3_BUCKET_USER_DATA) throw new Error("S3_BUCKET_USER_DATA is not defined."); 
    await putObject(
      process.env.S3_BUCKET_USER_DATA,
      `${id}/log/${log?.status || "error"}_log.json`,
      JSON.stringify(log),
      "application/json"
    );
    console.log("Saved log.");
    if (log.status === "canceled") {
      console.log("Saving user data...");
      await updateUserData(id, { status: UserDataStatus.GENERATOR_CANCELED });
      console.log("Saved user data.");
      return getBooleanResponse(true);
    }
    return getErrorResponse("Failed to cancel generator.");
  } catch (error) {
    console.log("error message :", error);
    return getErrorResponse(error.message);
  }
};
