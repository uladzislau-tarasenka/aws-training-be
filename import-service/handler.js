import AWS from 'aws-sdk';

import * as handlers from './src/functions';

const s3 = new AWS.S3({ region: 'eu-west-1' });
const sqs = new AWS.SQS();

export const importProductsFile = handlers.importProductsFileHandler(s3);
export const importFileParser = handlers.importFileParserHandler(s3, sqs);

