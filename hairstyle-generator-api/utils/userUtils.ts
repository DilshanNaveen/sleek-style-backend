import { dynamoDBGetItem, dynamoDBUpdateItem } from "./dbUtils";
import axios from "axios";
import { putObject } from "./s3Utils";
import { UserData } from "../types/userData";

export async function updateUserData(id: string, userData: any) {
    return await dynamoDBUpdateItem(
        process.env.DYNAMODB_TABLE_USER_DATA,
        "id",
        id,
        undefined,
        undefined,
        {
            lastModifiedDate: new Date().toISOString(),
            ...userData
        }
    )
};

export async function saveUserImageData(key: string, imageUrl: string) {
    const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
    });

    console.log("imageResponse :", imageResponse);
    const imageData = imageResponse.data;
    console.log("imageData :", imageData);

    return await putObject(process.env.S3_BUCKET_USER_DATA, key, imageData);
};

export async function getUserData(id: string): Promise<UserData> {
    const response = await dynamoDBGetItem(process.env.DYNAMODB_TABLE_USER_DATA, "id", id);
    console.log("response :", response);
    return response.Item;
};