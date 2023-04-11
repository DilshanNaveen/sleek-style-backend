import { Handler } from "aws-lambda";

type queryStringParameters = {
  id: string;
}

export const post: Handler = async (event: any, res: any) => {
  try {
    const { id = "Hi" }: queryStringParameters = event.queryStringParameters;
    
    console.log("id :", id);
    console.log("event.body :", event.body);

    res.sendStatus(200);
  } catch (error) {
    console.log('error message :', error);
    res.sendStatus(500);
  }
};
