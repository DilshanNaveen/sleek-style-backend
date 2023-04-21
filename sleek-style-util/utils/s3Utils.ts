const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CustomizationSettings } from "../types/userData";

export const S3_METHODS: any = {
    get: 'getObject',
    put: 'putObject'
};

export const getS3Method = (m: any) => S3_METHODS[m];

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
};

export const getSuggestions = async (config: CustomizationSettings, faceShape: string, maxKeys: number | undefined = 5, version: string | undefined = "v2") => {
    const path: string = `${version}/${config.gender}/${config.hairType}/${config.hairColor}/${config.hairLength}/${faceShape}`;
    console.log("path :", path);
    const s3Client = new S3Client({});
    const params = {
        Bucket: process.env.S3_BUCKET_HAIRSTYLE_SUGGESTIONS,
        Prefix: path,
        MaxKeys: maxKeys
    };
    const command = new ListObjectsCommand(params);
    const response = await s3Client.send(command);
    return response;
};

export async function getObject(bucket: string, key: string) {
    const s3Client = new S3Client({});
    const params = {
        Bucket: bucket,
        Key: key
    };
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    return response;
};

export async function putObject(bucket: string, key: string, payload: any, contentType: string  = "image/png") {
    const s3Client = new S3Client({});

    const putObjectCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: payload,
        ContentType: contentType,
    });

    const response = await s3Client.send(putObjectCommand);
    return response;
};