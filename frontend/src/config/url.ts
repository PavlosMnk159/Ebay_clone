export const BASE_URL = import.meta.env.VITE_BASE_URL as string;

console.log("the base url in url.ts is:", BASE_URL);

if (!BASE_URL) {
    throw new Error("BASE_URL not defined in environment variables");
}