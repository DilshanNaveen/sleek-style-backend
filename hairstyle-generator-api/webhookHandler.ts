import { Handler } from "aws-lambda";
import axios from "axios";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

type queryStringParameters = {
  id: string;
}

const s3Client = new S3Client({});

export const post: Handler = async (event: any, res: any) => {
  try {
    const { id = "Hi" }: queryStringParameters = event.queryStringParameters;
    
    console.log("id :", id);
    console.log("event.body :", event.body);

    const { status, output } = event.body;

    console.log('status :', event.body.status);
    console.log('output :', output);

    const imageResponse = await axios.get(output, { responseType: 'arraybuffer' });
    const imageData = imageResponse.data;

    // Upload the image to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_USER_DATA,
      Key: `${id}/generated_image.png`,
      Body: imageData,
      ContentType: 'image/png'
    });
    await s3Client.send(putObjectCommand);

    res.sendStatus(200);
  } catch (error) {
    console.log('error message :', error);
    res.sendStatus(500);
  }
};
