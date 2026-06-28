export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export interface ParseExternalApiErrorOptions {
  /** Default true — map 401 to session-expired error */
  sessionExpiredOn401?: boolean;
  sessionExpiredMessage?: string;
  invalidCredentialsMessage?: string;
}

export function parseExternalApiError(
  status: number,
  body: string,
  options?: ParseExternalApiErrorOptions,
): ApiError {
  const sessionExpiredOn401 = options?.sessionExpiredOn401 ?? true;
  const sessionExpiredMessage =
    options?.sessionExpiredMessage ??
    "Your session has expired. Please sign in again.";
  const invalidCredentialsMessage =
    options?.invalidCredentialsMessage ??
    "Invalid username or password. Please try again.";

  if (status === 401 && sessionExpiredOn401) {
    return new ApiError(sessionExpiredMessage, 401, "SESSION_EXPIRED");
  }

  if (status === 401) {
    return new ApiError(invalidCredentialsMessage, 401, "INVALID_CREDENTIALS");
  }

  try {
    const parsed = JSON.parse(body) as {
      error?: string;
      message?: string;
      errors?: Array<{ message?: string }>;
    };
    const message =
      parsed.errors?.[0]?.message ??
      parsed.message ??
      parsed.error ??
      `Request failed (${status})`;

    return new ApiError(message, status);
  } catch {
    return new ApiError(body.trim() || `Request failed (${status})`, status);
  }
}

export async function readExternalApiError(
  response: Response,
  options?: ParseExternalApiErrorOptions,
): Promise<ApiError> {
  const body = await response.text();
  return parseExternalApiError(response.status, body, options);
}
