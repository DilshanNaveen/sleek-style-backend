import AWS from 'aws-sdk';

export const dynamoDBPutItem = async (tableName, item) => {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        Item: item,
        TableName: tableName
    };
    console.log({ params });
    await docClient.put(params).promise();
};

export const dynamoDBQuery = async (tableName, partitionKeyName, partitionKeyVal, {
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

export const dynamoDBQueryWithParams = async (params, fetchAll, returnLastEvaluatedKey) => {
    console.log(params);
    const docClient = new AWS.DynamoDB.DocumentClient();
    let data: any = await docClient.query(params).promise();
    let items: any = data.Items;
    if (!fetchAll) return returnLastEvaluatedKey ? { items: data.Items, lastEvaluatedKey: data.LastEvaluatedKey } : data.Items;
    while (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        data = await docClient.query(params).promise();
        items.push(...data.Items);
    }
    return items;
};

export const dynamoDBGetItem = async (tableName, partitionKeyName, partitionKeyVal, sortKeyName = undefined, sortKeyVal = undefined, requiredAttributes: any = undefined, indexName) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
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

    const data = await docClient.get(params).promise();
    return data.Item;
};

export const dynamoDeleteItem = async (tableName, partitionKeyName, partitionKeyVal, sortKeyName = undefined, sortKeyVal = undefined) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let params = {
        TableName: tableName,
        Key: {
            [partitionKeyName]: partitionKeyVal,
            ...(sortKeyName ? { [sortKeyName]: sortKeyVal } : {})
        }
    };
    console.log({ params });

    const data = await docClient.delete(params).promise();
    return data;
};

export const dynamoDBScan = async (tableName, {
    requiredAttributes = undefined,
    expressionAttributeNames = undefined,
    expressionAttributeValues = undefined,
    filterExpression = undefined,
    limit = undefined,
    indexName = undefined,
    fetchAll = true
} = {}) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let params: any = {
        TableName: tableName,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };

    if (filterExpression) {
        params.FilterExpression = filterExpression;
    }

    if (requiredAttributes) {
        params.ProjectionExpression = requiredAttributes;
    }

    if (limit) {
        params.Limit = limit;
    }

    if (indexName) {
        params.IndexName = indexName;
    }
    console.log(params);

    let data: any = await docClient.scan(params).promise();
    if (!fetchAll) return data.Items;

    let items = data.Items;
    while (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        data = await docClient.scan(params).promise();
        items.push(...data.Items);
    }
    return items;
};

export const dynamoDBUpdateItem = async (tableName, partitionKeyName, partitionKeyVal, sortKeyName = undefined, sortKeyVal = undefined, keyValsToUpdate) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let updateExpression = '';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
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
    const data = await docClient.update(params).promise();
    return data;
};

export const dynamoDBBatchGet = async (requestItems) => {
    let params = {
        RequestItems: {
            ...requestItems
        }
    };
    var docClient = new AWS.DynamoDB.DocumentClient();
    const data = await docClient.batchGet(params).promise();
    return data.Responses;
};