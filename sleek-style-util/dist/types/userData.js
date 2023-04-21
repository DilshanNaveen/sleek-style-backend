"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairType = exports.HairLength = exports.HairColor = exports.Gender = exports.UserDataStatus = void 0;
var UserDataStatus;
(function (UserDataStatus) {
    UserDataStatus[UserDataStatus["WAITING_FOR_IMAGE"] = 0] = "WAITING_FOR_IMAGE";
    UserDataStatus[UserDataStatus["IMAGE_UPLOADED"] = 1] = "IMAGE_UPLOADED";
    UserDataStatus[UserDataStatus["FACE_SHAPE_PREDICTED"] = 2] = "FACE_SHAPE_PREDICTED";
    UserDataStatus[UserDataStatus["HAIRSTYLE_SUGGESTED"] = 3] = "HAIRSTYLE_SUGGESTED";
    UserDataStatus[UserDataStatus["START_GENERATING_HAIRSTYLE"] = 4] = "START_GENERATING_HAIRSTYLE";
    UserDataStatus[UserDataStatus["HAIRSTYLE_GENERATED"] = 5] = "HAIRSTYLE_GENERATED";
    UserDataStatus[UserDataStatus["GENERATOR_CANCELED"] = 6] = "GENERATOR_CANCELED";
})(UserDataStatus = exports.UserDataStatus || (exports.UserDataStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
var HairColor;
(function (HairColor) {
    HairColor["RED"] = "red";
    HairColor["BLACK"] = "black";
})(HairColor = exports.HairColor || (exports.HairColor = {}));
var HairLength;
(function (HairLength) {
    HairLength["SHORT"] = "short";
    HairLength["LONG"] = "long";
})(HairLength = exports.HairLength || (exports.HairLength = {}));
var HairType;
(function (HairType) {
    HairType["STRAIGHT"] = "straight";
    HairType["CURLY"] = "curly";
    HairType["WAVY"] = "wavy";
})(HairType = exports.HairType || (exports.HairType = {}));
