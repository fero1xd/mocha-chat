export default {
    providers: [
        {
            type: "customJwt",
            applicationId: `https://${process.env.VERCEL_URL}`,
            issuer: `https://${process.env.VERCEL_URL}`,
            jwks: `https://${process.env.VERCEL_URL}`,
            algorithm: "RS256",
        },
    ],
};