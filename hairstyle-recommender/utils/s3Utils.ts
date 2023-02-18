const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const S3_METHODS = {
    get: 'getObject',
    put: 'putObject'
};

export const getS3Method = (m) => S3_METHODS[m];

export async function getPreSignedUrl(
    bucket: any, 
    key: string, 
    method: string = S3_METHODS.get, 
    contentType: string | undefined = undefined, 
    expiresIn: number = 3600
    ) {
        const s3Client = new S3Client({});
        const payload = { Bucket: bucket, Key: key, ContentType: contentType };
        console.log("payload :", payload);
        let command;
        switch (method) {
            case S3_METHODS.put:
                command = new PutObjectCommand(payload);
                break;
            default:
                command = new GetObjectCommand(payload);
                break;
        }
        console.log('params :', command);
        return await getSignedUrl(s3Client, command, { expiresIn });
}