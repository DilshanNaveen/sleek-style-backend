# SleekStyle Backend

This is a serverless-based AWS Lambda repo for the SleekStyle project. It allows you to easily deploy and run the SleekStyle application on the AWS platform.

## Prerequisites

To deploy this serverless project, you'll need the following:

- An AWS account with the necessary permissions to create Lambda functions, API Gateway, and DynamoDB tables.
- AWS CLI installed on your local machine
- Node.js installed on your local machine

## Deploying the Serverless Code

To deploy the serverless code for SleekStyle, follow these steps:

1. Clone the repository to your local machine:
```
https://github.com/DilshanNaveen/sleek-style-backend.git
```

2. Navigate to the `sleekstyle-serverless` directory:
```
cd sleekstyle-serverless
```

3. Install the dependencies (use node 18):
```
npm install
```
4. Deploy the serverless stack to AWS:
```
sls deploy -r ap-southeast-1
```

5. Once the deployment is complete, you should see the URLs for the API Gateway endpoints in the console. You can use these URLs to test the application.

## Project Structure

The SleekStyle serverless project has the following structure:

- `utils` - Contains the util functions of the service.
- `types` - Contains the types of the objects.
- `serverless.yml` - Contains the configuration for the serverless stack, including the AWS resources to be deployed.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Dilshan Naveen dilshan@vertex.lk

## Acknowledgments

- Thanks to the AWS team for creating such a powerful platform!
- Thanks to the Serverless Framework for making serverless development so easy!
- Thanks to the creators of the SleekStyle project for inspiring us to build this application!

## Contact

If you have any questions or comments about this project, please feel free to reach out to me at dilshan@vertex.lk.


