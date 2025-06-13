export default {
    providers: [
        {
            type: "customJwt",
            applicationID: "http://localhost:3000",
            issuer: "http://localhost:3000",
            jwks: "https://xkvh4eozh6fh5e4t6s6r77w5740sjbdk.lambda-url.ap-south-1.on.aws",
            algorithm: "RS256",
        },
    ],
};