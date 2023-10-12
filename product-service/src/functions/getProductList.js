import data from '../mockData.json';

export const getProductList = async (event) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(
            data,
            null,
            2
        ),
    };
};
