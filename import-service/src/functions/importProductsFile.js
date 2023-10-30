export const importProductsFileHandler = (s3) => async (event) => {
    try {
        const catalogName = event.queryStringParameters.name;
        const catalogPath = `uploaded/${catalogName}`;

        const params = {
            Bucket: process.env.BUCKET,
            Key: catalogPath,
            Expires: 60,
            ContentType: 'text/csv'
        };

        const url = await s3.getSignedUrlPromise('putObject', params);

        console.log('url', url);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: url,
        };
    } catch (error) {
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