const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[] | undefined>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[] | undefined>
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string }).message ?? "Request failed",
      response.status,
      (data as { errors?: Record<string, string[] | undefined> }).errors
    );
  }

  return data as T;
}

export { API_BASE };
