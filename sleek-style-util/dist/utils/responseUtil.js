"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooleanResponse = exports.getSuccessResponse = exports.getErrorResponse = exports.getBadRequestResponse = void 0;
// Bad request util
var getBadRequestResponse = function (msg) {
    return {
        statusCode: 400,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            message: msg,
        })
    };
};
exports.getBadRequestResponse = getBadRequestResponse;
var getErrorResponse = function (msg) {
    return {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            message: msg,
        })
    };
};
exports.getErrorResponse = getErrorResponse;
var getSuccessResponse = function (jsonBody) {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(jsonBody),
    };
};
exports.getSuccessResponse = getSuccessResponse;
function getBooleanResponse(booleanResponse) {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: booleanResponse,
    };
}
exports.getBooleanResponse = getBooleanResponse;
;
