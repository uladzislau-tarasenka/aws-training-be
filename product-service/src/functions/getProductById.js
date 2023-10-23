export const getProductByIdHandler = (dbClient) => async (event) => {
    try {
        console.log('Incoming event: ', event);

        const { productId } = event.pathParameters;
        const { Item: product } = await dbClient.get({ TableName: process.env.DB_PRODUCTS, Key: { id: productId } }).promise() || null;

        if (!product) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(
                    {
                        message: 'Product was not found',
                    },
                    null,
                    2
                ),
            };
        }

        const { Items: stocks } = await dbClient.scan({
            TableName : process.env.DB_STOCKS,
            FilterExpression: 'product_id = :productId',
            ExpressionAttributeValues: {
                ":productId": productId
            }
        }).promise() || {};

        const joinProduct = { ...product, count: stocks[0].count };

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(
                joinProduct,
                null,
                2
            ),
        };
    } catch (err) {
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
};
