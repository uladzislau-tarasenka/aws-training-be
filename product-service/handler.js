import AWS from 'aws-sdk';

import * as handlers from "./src/functions";

const docClient = new AWS.DynamoDB.DocumentClient();

console.log(process.env);

export const getProductList = handlers.getProductListHandler(docClient);
export const getProductById = handlers.getProductByIdHandler(docClient);
export const createProduct = handlers.createProductHandler(docClient);