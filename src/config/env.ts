export function getEnv() {
  return {
    AUTH_BASE_URL: process.env.AUTH_BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  } as const;
}
