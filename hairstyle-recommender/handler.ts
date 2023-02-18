// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { getSuccessResponse, getErrorResponse } from "./utils/responseUtil";


// export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   try {
//     const result = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
//     return getSuccessResponse({ status: "SUCCESS", Test: `${process.env.S3_BUCKET_USER_DATA}`, result });
//   } catch (error) {
//     return getErrorResponse(error.message);
//   }
// };


import { Handler } from 'aws-lambda';
const axios = require('axios');

export const get: Handler = async (event: any) => {
  const result = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
        result
      },
      null,
      2
    ),
  };
}