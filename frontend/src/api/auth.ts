import client from "./client";

export interface LoginPayload { email: string; password: string; }
export interface AuthTokens   { access: string; refresh: string; }
export interface AuthResponse extends AuthTokens { user: User; }

export interface User {
  id: string; email: string; first_name: string; last_name: string;
  full_name: string; role: string; organization: string | null;
  organization_name: string | null; avatar_url: string | null;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    client.post<AuthResponse>("/auth/login/", payload).then((r) => r.data),

  logout: (refresh: string) =>
    client.post("/auth/logout/", { refresh }),

  me: () =>
    client.get<User>("/auth/me/").then((r) => r.data),

  refresh: (refresh: string) =>
    client.post<AuthTokens>("/auth/refresh/", { refresh }).then((r) => r.data),
};
