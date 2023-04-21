export declare const dynamoDBPutItem: (tableName: string, item: any) => Promise<any>;
export declare const dynamoDBQuery: (tableName: string, partitionKeyName: string, partitionKeyVal: any, { requiredAttributes, expressionAttributeNames, expressionAttributeValues, filterExpression, limit, sortDesc, indexName, fetchAll, returnLastEvaluatedKey, lastEvaluatedKey }?: {
    requiredAttributes?: undefined;
    expressionAttributeNames?: {} | undefined;
    expressionAttributeValues?: {} | undefined;
    filterExpression?: undefined;
    limit?: undefined;
    sortDesc?: boolean | undefined;
    indexName?: undefined;
    fetchAll?: boolean | undefined;
    returnLastEvaluatedKey?: boolean | undefined;
    lastEvaluatedKey?: undefined;
}) => Promise<any>;
export declare const dynamoDBQueryWithParams: (params: any, fetchAll: any, returnLastEvaluatedKey: any) => Promise<any>;
export declare const dynamoDBGetItem: (tableName: string, partitionKeyName: string, partitionKeyVal: any, sortKeyName?: string | undefined, sortKeyVal?: string | undefined, requiredAttributes?: any, indexName?: string | undefined) => Promise<any>;
export declare const dynamoDeleteItem: (tableName: string, partitionKeyName: string, partitionKeyVal: any, sortKeyName?: undefined, sortKeyVal?: undefined) => Promise<any>;
export declare const dynamoDBUpdateItem: (tableName: string, partitionKeyName: string, partitionKeyVal: any, sortKeyName: undefined, sortKeyVal: undefined, keyValsToUpdate: any) => Promise<any>;
