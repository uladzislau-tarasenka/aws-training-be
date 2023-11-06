import AWS from 'aws-sdk';

import * as handlers from "./src/functions";

const docClient = new AWS.DynamoDB.DocumentClient();

console.log(process.env);

export const basicAuthorizer = handlers.basicAuthorizerHandler(docClient);