export default {
    providers: [
        {
            type: "customJwt",
            applicationId: `https://${process.env.VERCEL_URL_FOR_CONVEX}`,
            issuer: `https://${process.env.VERCEL_URL_FOR_CONVEX}`,
            jwks: `https://${process.env.VERCEL_URL_FOR_CONVEX}`,
            algorithm: "RS256",
        },
    ],
};