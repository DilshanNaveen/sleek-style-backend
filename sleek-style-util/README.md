# Sleek-Style-Util
Sleek-Style-Util is an NPM package that provides utility functions and TypeScript types for the Sleek Style project. The package includes functions for interacting with Amazon DynamoDB and Amazon S3, as well as functions for formatting API responses and user authentication and authorization.

## Installation
Use the package manager npm to install Sleek-Style-Util.
```
$ npm install sleek-style-util
```

## Usage

To use Sleek-Style-Util, you need to import the required utility functions and TypeScript types in your project.

### Importing Modules

Sleek-Style-Util provides the following modules:

- `hairstyle`: TypeScript types related to hairstyle recommendations, such as the `Hairstyle` and `HairstyleOptions` types.
- `userData`: TypeScript types related to user data, such as the `User` and `UserProfile` types.
- `dbUtils`: Utility functions related to interacting with Amazon DynamoDB, such as `scanTable` and `putItem`.
- `responseUtil`: Utility functions related to formatting API responses, such as `success` and `error`.
- `userUtils`: Utility functions related to user authentication and authorization, such as `generateAuthToken` and `validateAuthToken`.
- `s3Utils`: Utility functions related to interacting with Amazon S3, such as `uploadFile` and `getFile`.
