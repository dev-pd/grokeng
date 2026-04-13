export function getApiOrigin(): string {
  const origin = import.meta.env.VITE_API_URL as string | undefined;

  // In dev, allow a safe localhost fallback.
  if (!origin && import.meta.env.DEV) return "http://localhost:8000";

  if (!origin) {
    throw new Error(
      "Missing VITE_API_URL. Set it to your backend origin (e.g. http://localhost:8000)."
    );
  }

  return origin;
}

export function getApiV1BaseUrl(): string {
  return `${getApiOrigin().replace(/\/$/, "")}/api/v1`;
}

