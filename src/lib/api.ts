export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export type LookupOptionResource = {
  value: string;
  label: string;
};

export type LookupGroupResource =
  | LookupOptionResource[]
  | {
      options?: LookupOptionResource[];
    };

export type LookupIndexResource = LookupOptionResource[];

type ApiSuccess<T> = {
  status: "success";
  data: T;
  meta?: {
    timestamp?: string;
    [key: string]: unknown;
  };
};

type ApiError = {
  status: "error";
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ field?: string; issue?: string }>;
  };
};

function unwrapApiResponse<T>(payload: T | ApiSuccess<T>): T {
  if (
    payload &&
    typeof payload === "object" &&
    "status" in payload &&
    (payload as { status?: unknown }).status === "success" &&
    "data" in payload
  ) {
    return (payload as ApiSuccess<T>).data;
  }

  return payload as T;
}

async function fetchJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection.");
  }

  if (!response.ok) {
    let detail = "Server error. Please try again later.";
    try {
      const data = (await response.json()) as ApiError | { detail?: string };
      if ("error" in data && data.error?.message) {
        detail = data.error.message;
      } else if ("detail" in data && data.detail) {
        detail = data.detail;
      }
    } catch {
      if (response.status < 500) {
        detail = `Request failed with status ${response.status}.`;
      }
    }
    throw new Error(detail);
  }

  const payload = (await response.json()) as T | ApiSuccess<T>;
  return unwrapApiResponse<T>(payload);
}

export function fetchLookupIndex() {
  return fetchJson<LookupIndexResource>("/api/lookups/");
}

export function fetchLookupGroup(group: string) {
  return fetchJson<LookupGroupResource>(`/api/lookups/${group}/`);
}
