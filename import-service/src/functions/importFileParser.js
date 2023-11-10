import csv from 'csv-parser';

const sendToQueue = async (queue, data) => {
    try {
        await queue
            .sendMessage({
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
            })
            .promise();
        console.log(`SQS message: ${JSON.stringify(data)}`);
    } catch (error) {
        console.log(`SQS error: ${JSON.stringify(error)}`);
    }
};

export const importFileParserHandler = (s3, sqs) => (event) => {
    const record = event.Records[0];
    const stream = s3.getObject({
        Bucket: process.env.BUCKET,
        Key: record.s3.object.key,
    }).createReadStream();

    stream.pipe(csv())
        .on('data', async (data) => sendToQueue(sqs, data))
        .on('error', (err) => console.log(`Streaming error: ${err}`))
        .on('end', async () => {
            await s3.copyObject({
                Bucket: process.env.BUCKET,
                CopySource: `${process.env.BUCKET}/${record.s3.object.key}`,
                Key: record.s3.object.key.replace('uploaded', 'parsed')
            }).promise();

            await s3.deleteObject({
                Bucket: process.env.BUCKET,
                Key: record.s3.object.key
            }).promise();

            console.log(`The file \'${record.s3.object.key}\' was moved from \'uploaded/\' to \'parsed/'`);
        });

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    };
}