export declare const getBadRequestResponse: (msg: string) => {
    statusCode: number;
    headers: {
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Credentials': boolean;
    };
    body: string;
};
export declare const getErrorResponse: (msg: string) => {
    statusCode: number;
    headers: {
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Credentials': boolean;
    };
    body: string;
};
export declare const getSuccessResponse: (jsonBody: any) => {
    statusCode: number;
    headers: {
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Credentials': boolean;
    };
    body: string;
};
export declare function getBooleanResponse(booleanResponse: boolean): {
    statusCode: number;
    headers: {
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Credentials': boolean;
    };
    body: boolean;
};
