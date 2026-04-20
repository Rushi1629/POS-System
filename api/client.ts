const BASE_URL = "https://secretcafe-api-production.up.railway.app/api/v1";

export const fetcher = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // ✅ cookie auth
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const err = await res.json();
      message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
};