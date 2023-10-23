import { v4 as uuidv4 } from 'uuid';

export const createProductHandler = (dbClient) => async (event) => {
    try {
        console.log('Incoming event: ', event);

        const { title, description, count, price } = JSON.parse(event.body);
        const productId = uuidv4();
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

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: 'The product was added'
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