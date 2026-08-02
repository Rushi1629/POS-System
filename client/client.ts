const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const clearAuthCookies = () => {
  const cookieNames = ["token", "access_token", "jwt"];

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax;`;
  });
};

export const fetcher = async (
  endpoint: string,
  options: RequestInit = {},
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
    if (res.status === 401 || res.status === 403) {
      clearAuthCookies();
    }

    let message = "Something went wrong";
    try {
      const err = await res.json();
      message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
};