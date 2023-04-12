import { Handler } from "aws-lambda";
import { UserDataStatus } from "./types/userData";
import { getUserData, updateUserData } from "./utils/userUtils";
import { putObject } from "./utils/s3Utils";
import axios from "axios";
import { getBooleanResponse, getErrorResponse } from "./utils/responseUtil";

type queryStringParameters = {
  id: string;
};

const cancelGeneratorModel = async (id: string) => {
  const { generatorId } = await getUserData(id);
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
    getErrorResponse("Failed to cancel generator.");
  } catch (error) {
    console.log("error message :", error);
    getErrorResponse(error.message);
  }
};
