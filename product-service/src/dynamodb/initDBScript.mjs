import AWS from 'aws-sdk';
import { readFileSync } from 'fs';
import { resolve } from 'path';

AWS.config.update({region: 'eu-west-1'});

const docClient = new AWS.DynamoDB.DocumentClient();


export const DB_PREFIX = 'aws-training-db';

export const init = async () => {
    await initProducts();
    await initStocks();
};

export const initProducts = async () => {
    try {
        const file = readFileSync(
            resolve('./src/dynamodb/mockProducts.json'),
        );

        const products = JSON.parse(file.toString());

        for (const item of products) {
            const params = {
                TableName: `${DB_PREFIX}__products`,
                Item: item,
            };

            await docClient.put(params).promise();
        }
    } catch (e) {
        console.log(e);
    }
};

export const initStocks = async () => {
    try {
        const file = readFileSync(
            resolve('./src/dynamodb/mockStocks.json'),
        );

        const stocks = JSON.parse(file.toString());

        for (const item of stocks) {
            const params = {
                TableName: `${DB_PREFIX}__stocks`,
                Item: item,
            };

            await docClient.put(params).promise();
        }
    } catch (e) {
        console.log(e);
    }
};

init();