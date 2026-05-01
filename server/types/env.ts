export const ENV = {
    appId: process.env.VITE_APP_ID ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
    cookieSecret: process.env.JWT_SECRET ?? "",
    isProduction: process.env.NODE_ENV === "production",
};