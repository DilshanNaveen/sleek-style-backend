import { UserData } from "../types/userData";
export declare function updateUserData(id: string, userData: any): Promise<any>;
export declare function saveUserImageData(key: string, imageUrl: string): Promise<any>;
export declare function getUserData(id: string): Promise<UserData>;
