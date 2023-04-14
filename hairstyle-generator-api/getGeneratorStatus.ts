import { Handler } from "aws-lambda";
import { getUserData } from "./utils/userUtils";
import axios from "axios";
import {
  getErrorResponse,
  getSuccessResponse,
} from "./utils/responseUtil";

type queryStringParameters = {
  id: string;
};

export const get: Handler = async (event: any) => {
  try {
    const { id }: queryStringParameters = event.queryStringParameters;
    const { generatorId } = await getUserData(id);
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
    const { status, output } = result.data;
    console.log("status :", status);
    console.log("output :", output);
    return getSuccessResponse({ status, output });
  } catch (error) {
    console.log("error message :", error);
    return getErrorResponse(error.message);
  }
};
