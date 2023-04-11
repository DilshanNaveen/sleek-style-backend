import { Handler } from "aws-lambda";

type queryStringParameters = {
  predictionId: string;
}

export const post: Handler = async (event: any, res: any) => {
  try {
    const { predictionId }: queryStringParameters = event.queryStringParameters;
    
    console.log("predictionId :", predictionId);
    console.log("event.body :", event.body);

    res.sendStatus(200);
  } catch (error) {
    console.log('error message :', error);
    res.sendStatus(500);
  }
};
