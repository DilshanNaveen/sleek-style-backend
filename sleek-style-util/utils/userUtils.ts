import { dynamoDBGetItem } from "./dbUtils";
import { UserData } from "../types/userData";

export async function getUserData(id: string): Promise<UserData> {
    const response = await dynamoDBGetItem(process.env.DYNAMODB_TABLE_USER_DATA as string, "id", id);
    console.log("response :", response);
    return response.Item;
};