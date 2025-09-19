export const BASE_URL = import.meta.env.VITE_BASE_URL as string;

console.log("the base url in url.ts is:", BASE_URL);

if (!BASE_URL) {
    throw new Error("BASE_URL not defined in environment variables");
}

export async function fetch_get(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetch_post(endpoint: string, body?: unknown) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined, // <-- Add the body here
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}