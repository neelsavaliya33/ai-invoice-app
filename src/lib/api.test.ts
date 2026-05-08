import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  changeAuthPassword,
  createUserCompany,
  clearAuthTokens,
  fetchAuthProfile,
  fetchUserCompanies,
  getAccessToken,
  getRefreshToken,
  loginAuthUser,
  setAuthTokens,
  updateAuthProfile,
} from "./api";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

function createStorage() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => store.clear()),
  };
}

const apiUser = {
  id: 7,
  email: "neel@koshpilot.app",
  name: "Neel Savaliya",
  emailVerified: true,
  hasCompany: false,
  is_staff: false,
  date_joined: "2026-05-08T10:00:00Z",
};

describe("auth API token and profile helpers", () => {
  beforeEach(() => {
    const localStorage = createStorage();
    vi.stubGlobal("window", { localStorage });
    vi.stubGlobal("fetch", vi.fn());
    clearAuthTokens();
  });

  it("stores login tokens and uses the access token for profile update", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          status: "success",
          data: {
            user: apiUser,
            auth: {
              type: "bearer",
              tokenType: "Bearer",
              access: "access-token",
              refresh: "refresh-token",
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: "success",
          data: { ...apiUser, name: "Neel S" },
        }),
      );

    const login = await loginAuthUser({
      email: "neel@koshpilot.app",
      password: "StrongPass123!",
    });
    const profile = await updateAuthProfile({ name: "Neel S", email: "neel@koshpilot.app" });

    expect(login.user.email).toBe("neel@koshpilot.app");
    expect(profile.name).toBe("Neel S");
    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBe("refresh-token");
    expect(fetchMock.mock.calls[1][1]?.headers).toMatchObject({
      Authorization: "Bearer access-token",
    });
    expect(fetchMock.mock.calls[1][1]?.body).toBe(JSON.stringify({ name: "Neel S", email: "neel@koshpilot.app" }));
  });

  it("posts password change with bearer token and returns updated user", async () => {
    setAuthTokens({ type: "bearer", access: "access-token", refresh: "refresh-token" });
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        status: "success",
        data: {
          passwordChanged: true,
          user: apiUser,
        },
      }),
    );

    const response = await changeAuthPassword({
      currentPassword: "OldStrongPass123!",
      newPassword: "NewStrongPass123!",
      confirmPassword: "NewStrongPass123!",
    });

    expect(response.passwordChanged).toBe(true);
    expect(response.user.email).toBe(apiUser.email);
    expect(fetchMock.mock.calls[0][0]).toContain("/api/auth/profile/password/");
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer access-token",
    });
  });

  it("refreshes an expired access token once and retries profile request", async () => {
    setAuthTokens({ type: "bearer", access: "expired-access", refresh: "valid-refresh" });
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ status: "error" }, { status: 401 }))
      .mockResolvedValueOnce(
        jsonResponse({
          status: "success",
          data: {
            type: "bearer",
            tokenType: "Bearer",
            access: "fresh-access",
            refresh: "rotated-refresh",
          },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: "success",
          data: apiUser,
        }),
      );

    const profile = await fetchAuthProfile();

    expect(profile.email).toBe(apiUser.email);
    expect(getAccessToken()).toBe("fresh-access");
    expect(getRefreshToken()).toBe("rotated-refresh");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][1]?.headers).toMatchObject({
      Authorization: "Bearer fresh-access",
    });
  });

  it("loads and creates registered user companies with bearer token", async () => {
    setAuthTokens({ type: "bearer", access: "access-token", refresh: "refresh-token" });
    const fetchMock = vi.mocked(fetch);
    const company = {
      id: "kavya-textiles",
      name: "Kavya Textiles",
      legalName: "Kavya Textiles Private Limited",
      initials: "KT",
      industry: "Textile",
      gstin: "24ABCDE1234F1Z5",
      city: "Ahmedabad",
      state: "Gujarat",
      currency: "INR",
      financialYear: "FY 2026-27",
      role: "Owner",
      salesThisMonth: 0,
      receivables: 0,
      stockValue: 0,
    };
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ status: "success", data: [company] }))
      .mockResolvedValueOnce(jsonResponse({ status: "success", data: company }, { status: 201 }));

    const companies = await fetchUserCompanies();
    const created = await createUserCompany({
      name: "Kavya Textiles",
      legal_name: "Kavya Textiles Private Limited",
      industry: "Textile",
      gstin: "24ABCDE1234F1Z5",
      city: "Ahmedabad",
      state: "Gujarat",
      financial_year: "FY 2026-27",
    });

    expect(companies).toHaveLength(1);
    expect(created.id).toBe("kavya-textiles");
    expect(fetchMock.mock.calls[0][0]).toContain("/api/companies/");
    expect(fetchMock.mock.calls[1][1]?.method).toBe("POST");
    expect(fetchMock.mock.calls[1][1]?.headers).toMatchObject({
      Authorization: "Bearer access-token",
    });
  });

  it("keeps an empty company list as an empty API result", async () => {
    setAuthTokens({ type: "bearer", access: "access-token", refresh: "refresh-token" });
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(jsonResponse({ status: "success", data: [] }));

    const companies = await fetchUserCompanies();

    expect(companies).toEqual([]);
    expect(fetchMock.mock.calls[0][0]).toContain("/api/companies/");
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer access-token",
    });
  });
});
