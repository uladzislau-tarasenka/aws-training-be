const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
    };
  };

export const basicAuthorizerHandler = () => async (event, context, callback) => {
    console.log('Incoming event: ', event);

    const { token, methodArn, type } = event;

    if (type !== 'TOKEN' || !token) {
        callback('Unauthorized');
    }

    try {
        const [, encodedCreds] = token.split(' ');
        const decodedCreds = Buffer.from(encodedCreds, 'base64').toString('utf-8');
        const [username, password] = decodedCreds.split('=');
        const expectedPassword = process.env[username];

        const effect = !expectedPassword || password !== expectedPassword ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, methodArn, effect);

        callback(null, policy);
    } catch (e) {
        console.log('Incoming error: ', e);

        callback(`Unauthorized: ${e.message}`);
    }
};
