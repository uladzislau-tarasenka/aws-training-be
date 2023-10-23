import dotenv from 'dotenv';

export default async () => {
    const envVars = dotenv.config({ path: '.env.local' }).parsed;

    return { ...envVars, ...process.env };

};