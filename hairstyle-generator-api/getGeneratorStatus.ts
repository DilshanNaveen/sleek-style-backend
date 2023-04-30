import { Handler } from "aws-lambda";
import axios from "axios";
import { UserData, UserDataStatus } from "sleek-style-util/dist/types/userData";
import { getSuccessResponse, getErrorResponse } from "sleek-style-util/dist/utils/responseUtil";
import { getUserData } from "sleek-style-util/dist/utils/userUtils";

type queryStringParameters = {
  id: string;
};

export const get: Handler = async (event: any) => {
  try {
    const { id }: queryStringParameters = event.queryStringParameters;
    let { generatorId, customizationSettings, faceShape, generatedHairstyle, status }: UserData = await getUserData(id);
    let output: any = generatedHairstyle;
    console.log("output :", output);
    if (!output) {
      const result = await axios({
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REPLICATE_API_URL as string}/${generatorId}`,
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN as string}`,
          "Content-Type": "application/json",
        },
      });
      console.log("result :", result.data);
      status = result.data.status;
      output = result.data.output;
      console.log("status :", status);
      console.log("output :", output);
    }
    return getSuccessResponse({ status, output, customizationSettings, faceShape });
  } catch (error) {
    console.log("error message :", error);
    return getErrorResponse(error.message);
  }
};
