import AWS from 'aws-sdk';

import * as handlers from "./src/functions";

const docClient = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS();

console.log(process.env);

export const getProductList = handlers.getProductListHandler(docClient);
export const getProductById = handlers.getProductByIdHandler(docClient);
export const createProduct = handlers.createProductHandler(docClient);
export const catalogBatchProcess = handlers.catalogBatchProcessHandler(docClient, sns);