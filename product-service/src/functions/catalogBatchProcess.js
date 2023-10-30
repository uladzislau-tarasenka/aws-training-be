import { v4 as uuidv4 } from 'uuid';

export const catalogBatchProcessHandler = (dbClient, sns) => async (event) => {
    try {
        console.log('Incoming event: ', event);

        for (const record of event.Records) {
            const { id, title, description, count, price } = JSON.parse(record.body);
            const productId = id || uuidv4();
            const item = {
                id: productId,
                title,
                price,
                description,
            };

            const stock = {
                id: uuidv4(),
                product_id: productId,
                count,
            };

            await dbClient.put({ TableName: process.env.DB_PRODUCTS, Item: item }).promise();
            await dbClient.put({ TableName: process.env.DB_STOCKS, Item: stock }).promise();

            await sns
                .publish({
                    Subject: 'Products were uploaded',
                    Message: record.body,
                    TopicArn: process.env.SNS_ARN,
                })
                .promise();
        }

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        };
    }
    catch (err) {
        console.log('Incoming error: ', err);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: 'Internal Server Error'
        }
    }
}