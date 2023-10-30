import csv from 'csv-parser';

export const importFileParserHandler = (s3) => (event) => {
    const record = event.Records[0];
    const stream = s3.getObject({
        Bucket: process.env.BUCKET,
        Key: record.s3.object.key,
    }).createReadStream();

    stream.pipe(csv())
        .on('data', (data) => console.log(`The chuck of data: ${JSON.stringify(data)}`))
        .on('error', (err) => console.log(`The error has appeared during streaming: ${err}`))
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
}