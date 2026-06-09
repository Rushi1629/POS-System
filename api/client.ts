const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // ✅ cookie auth
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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