const url = "https://t3-chat-khaki.vercel.app";
export default {
    providers: [
        {
            type: "customJwt",
            applicationId: url,
            issuer: url,
            jwks: url,
            algorithm: "RS256",
        },
    ],
};