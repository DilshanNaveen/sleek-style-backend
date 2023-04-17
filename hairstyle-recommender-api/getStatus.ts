import { Handler } from "aws-lambda";
import { getErrorResponse, getSuccessResponse } from "./utils/responseUtil";
import { getUserData } from "./utils/userUtils";

type queryStringParameters = {
    id: string;
};

export const get: Handler = async (event: any) => {
    try {
        const { id }: queryStringParameters = event.queryStringParameters;
        const { status } = await getUserData(id);
        return getSuccessResponse({ status });
    } catch (error) {
        console.log('error message :', error);
        return getErrorResponse(error.message);
    }
};