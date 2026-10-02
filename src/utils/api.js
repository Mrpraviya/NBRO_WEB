const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}/${String(path).replace(/^\//, "")}`;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const responseBody = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof responseBody === "string"
      ? responseBody
      : responseBody.message || responseBody.error || responseBody.detail;
    throw new Error(message || `Request failed (${response.status})`);
  }

  return responseBody;
}