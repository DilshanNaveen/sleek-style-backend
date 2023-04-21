"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDBUpdateItem = exports.dynamoDeleteItem = exports.dynamoDBGetItem = exports.dynamoDBQueryWithParams = exports.dynamoDBQuery = exports.dynamoDBPutItem = void 0;
var DynamoDBClient = require("@aws-sdk/client-dynamodb").DynamoDBClient;
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var dynamoDBPutItem = function (tableName, item) { return __awaiter(void 0, void 0, void 0, function () {
    var docClient, params;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                docClient = new DynamoDBClient();
                params = {
                    Item: item,
                    TableName: tableName
                };
                console.log({ params: params });
                return [4 /*yield*/, docClient.send(new lib_dynamodb_1.PutCommand(params))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.dynamoDBPutItem = dynamoDBPutItem;
var dynamoDBQuery = function (tableName, partitionKeyName, partitionKeyVal, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.requiredAttributes, requiredAttributes = _c === void 0 ? undefined : _c, _d = _b.expressionAttributeNames, expressionAttributeNames = _d === void 0 ? {} : _d, _e = _b.expressionAttributeValues, expressionAttributeValues = _e === void 0 ? {} : _e, _f = _b.filterExpression, filterExpression = _f === void 0 ? undefined : _f, _g = _b.limit, limit = _g === void 0 ? undefined : _g, _h = _b.sortDesc, sortDesc = _h === void 0 ? false : _h, _j = _b.indexName, indexName = _j === void 0 ? undefined : _j, _k = _b.fetchAll, fetchAll = _k === void 0 ? true : _k, _l = _b.returnLastEvaluatedKey, returnLastEvaluatedKey = _l === void 0 ? false : _l, _m = _b.lastEvaluatedKey, lastEvaluatedKey = _m === void 0 ? undefined : _m;
    return __awaiter(void 0, void 0, void 0, function () {
        var params, items;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    params = {
                        TableName: tableName,
                        KeyConditionExpression: '#parKey = :parKeyVal',
                        ExpressionAttributeNames: __assign({ '#parKey': partitionKeyName }, expressionAttributeNames),
                        ExpressionAttributeValues: __assign({ ':parKeyVal': partitionKeyVal }, expressionAttributeValues)
                    };
                    if (filterExpression)
                        params.FilterExpression = filterExpression;
                    if (requiredAttributes)
                        params.ProjectionExpression = requiredAttributes;
                    if (limit)
                        params.Limit = limit;
                    if (sortDesc)
                        params.ScanIndexForward = false;
                    if (indexName)
                        params.IndexName = indexName;
                    if (lastEvaluatedKey)
                        params.ExclusiveStartKey = lastEvaluatedKey;
                    console.log(params);
                    return [4 /*yield*/, (0, exports.dynamoDBQueryWithParams)(params, fetchAll, returnLastEvaluatedKey)];
                case 1:
                    items = _o.sent();
                    return [2 /*return*/, items];
            }
        });
    });
};
exports.dynamoDBQuery = dynamoDBQuery;
var dynamoDBQueryWithParams = function (params, fetchAll, returnLastEvaluatedKey) { return __awaiter(void 0, void 0, void 0, function () {
    var docClient, data, items;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(params);
                docClient = new DynamoDBClient();
                return [4 /*yield*/, docClient.send(new lib_dynamodb_1.QueryCommand(params))];
            case 1:
                data = _a.sent();
                items = data.Items;
                if (!fetchAll)
                    return [2 /*return*/, returnLastEvaluatedKey ? { items: data.Items, lastEvaluatedKey: data.LastEvaluatedKey } : data.Items];
                _a.label = 2;
            case 2:
                if (!data.LastEvaluatedKey) return [3 /*break*/, 4];
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                return [4 /*yield*/, docClient.send(new lib_dynamodb_1.QueryCommand(params))];
            case 3:
                data = _a.sent();
                items.push.apply(items, data.Items);
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/, items];
        }
    });
}); };
exports.dynamoDBQueryWithParams = dynamoDBQueryWithParams;
var dynamoDBGetItem = function (tableName, partitionKeyName, partitionKeyVal, sortKeyName, sortKeyVal, requiredAttributes, indexName) {
    if (sortKeyName === void 0) { sortKeyName = undefined; }
    if (sortKeyVal === void 0) { sortKeyVal = undefined; }
    if (requiredAttributes === void 0) { requiredAttributes = undefined; }
    if (indexName === void 0) { indexName = undefined; }
    return __awaiter(void 0, void 0, void 0, function () {
        var docClient, params;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    docClient = new DynamoDBClient();
                    params = {
                        TableName: tableName,
                        Key: __assign((_a = {}, _a[partitionKeyName] = partitionKeyVal, _a), (sortKeyName ? (_b = {}, _b[sortKeyName] = sortKeyVal, _b) : {}))
                    };
                    if (requiredAttributes) {
                        params.ProjectionExpression = requiredAttributes.join();
                    }
                    if (indexName) {
                        params.IndexName = indexName;
                    }
                    console.log({ params: params });
                    return [4 /*yield*/, docClient.send(new lib_dynamodb_1.GetCommand(params))];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    });
};
exports.dynamoDBGetItem = dynamoDBGetItem;
var dynamoDeleteItem = function (tableName, partitionKeyName, partitionKeyVal, sortKeyName, sortKeyVal) {
    if (sortKeyName === void 0) { sortKeyName = undefined; }
    if (sortKeyVal === void 0) { sortKeyVal = undefined; }
    return __awaiter(void 0, void 0, void 0, function () {
        var docClient, params;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    docClient = new DynamoDBClient();
                    params = {
                        TableName: tableName,
                        Key: __assign((_a = {}, _a[partitionKeyName] = partitionKeyVal, _a), (sortKeyName ? (_b = {}, _b[sortKeyName] = sortKeyVal, _b) : {}))
                    };
                    console.log({ params: params });
                    return [4 /*yield*/, docClient.send(new lib_dynamodb_1.DeleteCommand(params))];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    });
};
exports.dynamoDeleteItem = dynamoDeleteItem;
var dynamoDBUpdateItem = function (tableName, partitionKeyName, partitionKeyVal, sortKeyName, sortKeyVal, keyValsToUpdate) {
    if (sortKeyName === void 0) { sortKeyName = undefined; }
    if (sortKeyVal === void 0) { sortKeyVal = undefined; }
    return __awaiter(void 0, void 0, void 0, function () {
        var docClient, updateExpression, expressionAttributeNames, expressionAttributeValues, i, _i, _a, _b, key, val, namePlaceholder, valPlaceholder, params;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    docClient = new DynamoDBClient();
                    updateExpression = '';
                    expressionAttributeNames = {};
                    expressionAttributeValues = {};
                    i = 0;
                    for (_i = 0, _a = Object.entries(keyValsToUpdate); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], val = _b[1];
                        namePlaceholder = "#n".concat(i);
                        valPlaceholder = ":v".concat(i);
                        updateExpression = "".concat(updateExpression).concat(i == 0 ? 'set' : ',', " ").concat(namePlaceholder, " = ").concat(valPlaceholder);
                        expressionAttributeNames[namePlaceholder] = key;
                        expressionAttributeValues[valPlaceholder] = val;
                        i++;
                    }
                    params = {
                        TableName: tableName,
                        Key: __assign((_c = {}, _c[partitionKeyName] = partitionKeyVal, _c), (sortKeyName ? (_d = {},
                            _d[sortKeyName] = sortKeyVal,
                            _d) : {})),
                        UpdateExpression: updateExpression,
                        ExpressionAttributeNames: expressionAttributeNames,
                        ExpressionAttributeValues: expressionAttributeValues
                    };
                    console.log({ params: params });
                    return [4 /*yield*/, docClient.send(new lib_dynamodb_1.UpdateCommand(params))];
                case 1: return [2 /*return*/, _e.sent()];
            }
        });
    });
};
exports.dynamoDBUpdateItem = dynamoDBUpdateItem;
