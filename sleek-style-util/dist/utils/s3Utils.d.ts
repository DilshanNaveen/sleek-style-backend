import { CustomizationSettings } from "../types/userData";
export declare const S3_METHODS: any;
export declare const getS3Method: (m: any) => any;
export declare function getPreSignedUrl(bucket: any, key: string, method?: string, contentType?: string | undefined, expiresIn?: number): Promise<string>;
export declare const getSuggestions: (config: CustomizationSettings, faceShape: string, maxKeys?: number | undefined, version?: string | undefined) => Promise<any>;
export declare function getObject(bucket: string, key: string): Promise<any>;
export declare function putObject(bucket: string, key: string, payload: any, contentType?: string): Promise<any>;
