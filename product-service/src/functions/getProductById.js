import data from '../mockData.json';

export const getProductById = async (event) => {
    const { productId } = event.pathParameters;
    const product = data.find(product => product.id === productId);

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

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(
            product,
            null,
            2
        ),
    };
};
