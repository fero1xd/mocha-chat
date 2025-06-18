const url = "https://mocha.fairmine.live";
export default {
    providers: [
        {
            type: "customJwt",
            applicationId: url,
            issuer: url,
            jwks: `${url}/api/auth/jwks`,
            algorithm: "RS256",
        },
    ],
};