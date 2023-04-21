const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
import { PutCommand, UpdateCommand, DeleteCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const dynamoDBPutItem = async (tableName: string, item: any) => {
    const docClient = new DynamoDBClient();
    const params = {
        Item: item,
        TableName: tableName
    };
    console.log({ params });
    return await docClient.send(new PutCommand(params))
};

export const dynamoDBQuery = async (tableName: string, partitionKeyName: string, partitionKeyVal: any, {
    requiredAttributes = undefined,
    expressionAttributeNames = {},
    expressionAttributeValues = {},
    filterExpression = undefined,
    limit = undefined,
    sortDesc = false,
    indexName = undefined,
    fetchAll = true,
    returnLastEvaluatedKey = false,
    lastEvaluatedKey = undefined
} = {}) => {
    let params: any = {
        TableName: tableName,
        KeyConditionExpression: '#parKey = :parKeyVal',
        ExpressionAttributeNames: { '#parKey': partitionKeyName, ...expressionAttributeNames },
        ExpressionAttributeValues: { ':parKeyVal': partitionKeyVal, ...expressionAttributeValues }
    };

    if (filterExpression) params.FilterExpression = filterExpression;
    if (requiredAttributes) params.ProjectionExpression = requiredAttributes;
    if (limit) params.Limit = limit;
    if (sortDesc) params.ScanIndexForward = false;
    if (indexName) params.IndexName = indexName;
    if (lastEvaluatedKey) params.ExclusiveStartKey = lastEvaluatedKey;

    console.log(params);
    let items = await dynamoDBQueryWithParams(params, fetchAll, returnLastEvaluatedKey);
    return items;
};

export const dynamoDBQueryWithParams = async (params: any, fetchAll: any, returnLastEvaluatedKey: any) => {
    console.log(params);
    const docClient = new DynamoDBClient();
    let data: any = await docClient.send(new QueryCommand(params));
    let items: any = data.Items;
    if (!fetchAll) return returnLastEvaluatedKey ? { items: data.Items, lastEvaluatedKey: data.LastEvaluatedKey } : data.Items;
    while (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        data =  await docClient.send(new QueryCommand(params));
        items.push(...data.Items);
    }
    return items;
};

export const dynamoDBGetItem = async (tableName: string, partitionKeyName: string, partitionKeyVal: any, sortKeyName: string | undefined = undefined, sortKeyVal: string | undefined = undefined, requiredAttributes: any = undefined, indexName: string | undefined = undefined) => {
    const docClient = new DynamoDBClient();
    let params: any = {
        TableName: tableName,
        Key: {
            [partitionKeyName]: partitionKeyVal,
            ...(sortKeyName ? { [sortKeyName]: sortKeyVal } : {})
        }
    };
    if (requiredAttributes) {
        params.ProjectionExpression = requiredAttributes.join();
    }
    if (indexName) {
        params.IndexName = indexName;
    }
    console.log({ params });

    return await docClient.send(new GetCommand(params));;
};

export const dynamoDeleteItem = async (tableName: string, partitionKeyName: string, partitionKeyVal: any, sortKeyName = undefined, sortKeyVal = undefined) => {
    const docClient = new DynamoDBClient();
    let params = {
        TableName: tableName,
        Key: {
            [partitionKeyName]: partitionKeyVal,
            ...(sortKeyName ? { [sortKeyName]: sortKeyVal } : {})
        }
    };
    console.log({ params });

    return await docClient.send(new DeleteCommand(params));;
};

export const dynamoDBUpdateItem = async (tableName: string, partitionKeyName: string, partitionKeyVal: any, sortKeyName = undefined, sortKeyVal = undefined, keyValsToUpdate: any) => {
    const docClient = new DynamoDBClient();
    let updateExpression = '';
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};
    let i = 0;

    for (const [key, val] of Object.entries(keyValsToUpdate)) {
        let namePlaceholder = `#n${i}`;
        let valPlaceholder = `:v${i}`;
        updateExpression = `${updateExpression}${i == 0 ? 'set' : ','} ${namePlaceholder} = ${valPlaceholder}`;
        expressionAttributeNames[namePlaceholder] = key;
        expressionAttributeValues[valPlaceholder] = val;
        i++;
    }

    let params = {
        TableName: tableName,
        Key: {
            [partitionKeyName]: partitionKeyVal,
            ...(sortKeyName ? {
                [sortKeyName]: sortKeyVal
            } : {})
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };
    console.log({ params });
    return await docClient.send(new UpdateCommand(params));;
};