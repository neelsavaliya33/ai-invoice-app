export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const ACCESS_TOKEN_KEY = "koshpilot.accessToken";
const REFRESH_TOKEN_KEY = "koshpilot.refreshToken";

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

export type PlanFeatureResource = {
  group: "highlight" | "included" | "limit" | "note";
  title: string;
  description: string;
};

export type PlanCapabilityResource = {
  code: string;
  stableCode: string;
  name: string;
  description?: string;
  limit?: {
    value?: number | null;
    unit?: string;
  };
  config?: Record<string, unknown>;
};

export type PlanModuleResource = {
  code: string;
  name: string;
  description: string;
  capabilities: PlanCapabilityResource[];
};

export type PlanResource = {
  code: string;
  name: string;
  description: string;
  price: {
    amount: number | null;
    currency: string;
    display: string;
  };
  billingPeriod: string;
  billingLabel: string;
  companyLimit: number;
  userLimit: number;
  aiCreditLimit: number;
  ewayBillLimit: number;
  trialDays: number;
  recommended: boolean;
  features: PlanFeatureResource[];
  modules: PlanModuleResource[];
  addOns: PlanAddOnResource[];
};

export type PlanAddOnResource = {
  code: string;
  name: string;
  description: string;
  price: {
    amount: number | null;
    currency: string;
    display: string;
  };
  billingLabel: string;
  quantity?: number | null;
  quantityUnit?: string;
};

export type TrialConfigResource = {
  planCode: string;
  planName: string;
  trialDays: number;
  aiCreditLimit: number;
  companyLimit: number;
  userLimit: number;
};

export type CompanyResource = {
  id: string;
  name: string;
  legalName: string;
  initials: string;
  industry: string;
  gstin: string;
  city: string;
  state: string;
  currency: string;
  financialYear: string;
  role: string;
  salesThisMonth: number;
  receivables: number;
  stockValue: number;
};

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

type FetchJsonOptions = RequestInit & {
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

export type AuthTokenResource = {
  type: "bearer";
  tokenType?: "Bearer";
  access: string;
  refresh?: string;
};

let refreshPromise: Promise<string | null> | null = null;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAccessToken() {
  return canUseStorage() ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}

export function getRefreshToken() {
  return canUseStorage() ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;
}

export function setAuthTokens(auth?: Partial<AuthTokenResource> | null) {
  if (!canUseStorage() || !auth?.access) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, auth.access);
  if (auth.refresh) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, auth.refresh);
  }
}

export function clearAuthTokens() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

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

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    clearAuthTokens();
    return null;
  }
  const payload = (await response.json()) as ApiSuccess<AuthTokenResource> | AuthTokenResource;
  const auth = unwrapApiResponse<AuthTokenResource>(payload);
  setAuthTokens(auth);
  return auth.access;
}

function refreshAccessTokenOnce() {
  refreshPromise ??= refreshAccessToken().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function fetchJson<T>(path: string, init?: FetchJsonOptions): Promise<T> {
  const { skipAuth, skipRefresh, headers, ...requestInit } = init ?? {};
  const accessToken = skipAuth ? null : getAccessToken();
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
        ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      ...requestInit,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection.");
  }

  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const refreshedAccessToken = await refreshAccessTokenOnce();
    if (refreshedAccessToken) {
      return fetchJson<T>(path, { ...init, skipRefresh: true });
    }
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

function postJson<T>(path: string, body?: unknown) {
  return fetchJson<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function patchJson<T>(path: string, body: unknown) {
  return fetchJson<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function fetchLookupIndex() {
  return fetchJson<LookupIndexResource>("/api/lookups/");
}

export function fetchLookupGroup(group: string) {
  return fetchJson<LookupGroupResource>(`/api/lookups/${group}/`);
}

export function fetchPlans() {
  return fetchJson<PlanResource[]>("/api/plans/");
}

export function fetchPlan(code: string) {
  return fetchJson<PlanResource>(`/api/plans/${code}/`);
}

export function fetchPlanModules() {
  return fetchJson<PlanModuleResource[]>("/api/plans/modules/");
}

export function fetchPlanAddOns() {
  return fetchJson<PlanAddOnResource[]>("/api/plans/add-ons/");
}

export function fetchTrialConfig() {
  return fetchJson<TrialConfigResource>("/api/plans/trial/");
}

export function fetchUserCompanies() {
  return fetchJson<CompanyResource[]>("/api/companies/");
}

export function createUserCompany(payload: {
  name: string;
  legal_name?: string;
  industry: string;
  gstin?: string;
  city: string;
  state: string;
  currency?: string;
  financial_year?: string;
}) {
  return postJson<CompanyResource>("/api/companies/", payload);
}

export type AuthUserResource = {
  id: number;
  email: string;
  name: string;
  emailVerified: boolean;
  hasCompany: boolean;
  is_staff: boolean;
  date_joined: string;
};

export type AuthOtpResource = {
  email: string;
  purpose: "verify_email" | "password_reset";
  otpRequired: boolean;
  expiresInMinutes?: number;
  emailSent?: boolean;
  devOtp?: string;
};

export type AuthSessionResource = {
  user: AuthUserResource;
  auth?: AuthTokenResource;
  verification?: AuthOtpResource;
};

export type AuthOtpVerifyResource = {
  verified: boolean;
  purpose: string;
  user: AuthUserResource | null;
  auth: AuthTokenResource | null;
};

export function requestAuthOtp(email: string, purpose: "verify_email" | "password_reset" = "verify_email") {
  return fetchJson<AuthOtpResource>("/api/auth/otp/resend/", {
    method: "POST",
    body: JSON.stringify({ email, purpose }),
    skipAuth: true,
  });
}

export async function verifyAuthOtp(email: string, otp: string, purpose: "verify_email" | "password_reset" = "verify_email") {
  const response = await fetchJson<AuthOtpVerifyResource>("/api/auth/otp/verify/", {
    method: "POST",
    body: JSON.stringify({ email, otp, purpose }),
    skipAuth: true,
  });
  setAuthTokens(response.auth);
  return response;
}

export async function registerAuthUser(payload: { email: string; password: string; name: string }) {
  const response = await fetchJson<AuthSessionResource>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
  setAuthTokens(response.auth);
  return response;
}

export async function loginAuthUser(payload: { email: string; password: string }) {
  const response = await fetchJson<AuthSessionResource>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
  setAuthTokens(response.auth);
  return response;
}

export async function logoutAuthUser() {
  const refresh = getRefreshToken();
  try {
    return await fetchJson<{ signedOut: boolean }>("/api/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
      skipAuth: true,
      skipRefresh: true,
    });
  } finally {
    clearAuthTokens();
  }
}

export function fetchAuthProfile() {
  return fetchJson<AuthUserResource>("/api/auth/profile/");
}

export function updateAuthProfile(payload: { name?: string; email?: string }) {
  return patchJson<AuthUserResource>("/api/auth/profile/", payload);
}

export function changeAuthPassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return postJson<{ passwordChanged: boolean; user: AuthUserResource }>("/api/auth/profile/password/", payload);
}

export function requestPasswordReset(email: string) {
  return postJson<AuthOtpResource>("/api/auth/password-reset/request/", { email });
}

export function confirmPasswordReset(payload: { email: string; otp: string; newPassword: string }) {
  return postJson<{ passwordReset: boolean; user: AuthUserResource }>("/api/auth/password-reset/confirm/", payload);
}
