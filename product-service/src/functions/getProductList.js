export const getProductListHandler = (dbClient) => async (event) => {
    try {
        console.log('Incoming event: ', event);

        const { Items: products } = await dbClient.scan({ TableName: process.env.DB_PRODUCTS }).promise();
        const { Items: stocks } = await dbClient.scan({ TableName: process.env.DB_STOCKS }).promise();

        const joinData = products.map(product => {
            const stock = stocks.find(stock => stock.product_id === product.id) || {};

            return { ...product, count: stock.count };
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(
                joinData,
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
