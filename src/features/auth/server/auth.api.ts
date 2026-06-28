import { getEnv } from "@/config/env";
import {
  INVALID_CREDENTIALS_MESSAGE,
  SESSION_EXPIRED_USER_MESSAGE,
} from "@/features/auth/constants/session";
import type {
  TokenResponse,
  UserProfileResponse,
} from "@/features/auth/types/auth";
import { readExternalApiError } from "@/lib/api/api-error";

export async function fetchAccessToken(
  username: string,
  password: string,
): Promise<TokenResponse> {
  const { AUTH_BASE_URL, CLIENT_ID, CLIENT_SECRET } = getEnv();

  if (!AUTH_BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing auth configurations in environment variables");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("scope", "openid");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("username", username);
  params.append("password", password);

  const response = await fetch(
    `${AUTH_BASE_URL}/t/101digital.core/oauth2/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    throw await readExternalApiError(response, {
      sessionExpiredOn401: false,
      invalidCredentialsMessage: INVALID_CREDENTIALS_MESSAGE,
    });
  }

  return response.json() as Promise<TokenResponse>;
}

export async function fetchUserProfile(
  accessToken: string,
): Promise<UserProfileResponse> {
  const { API_BASE_URL } = getEnv();

  if (!API_BASE_URL) {
    throw new Error("Missing API_BASE_URL configurations");
  }

  const response = await fetch(
    `${API_BASE_URL}/membership-service/1.0.0/users/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw await readExternalApiError(response, {
      sessionExpiredMessage: SESSION_EXPIRED_USER_MESSAGE,
    });
  }

  return response.json() as Promise<UserProfileResponse>;
}
