const url = "https://t3-chat-4iktnk57v-pranjalfxd.vercel.app";
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