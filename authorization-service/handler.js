import * as handlers from "./src/functions";

console.log(process.env);

export const basicAuthorizer = handlers.basicAuthorizerHandler();