export const GET = () => {
  return new Response(
    JSON.stringify({
      deploymentId:
        process.env.NODE_ENV === "development"
          ? "DEV"
          : process.env.VERCEL_DEPLOYMENT_ID,
    })
  );
};
