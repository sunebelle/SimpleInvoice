import { headers } from "next/headers";

function getBffBaseUrl(headersList: Headers): string {
  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

/** Server-only fetch to this app's BFF routes (forwards session cookies). */
export async function bffFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getBffBaseUrl(headersList)}${normalizedPath}`;

  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      cookie,
    },
    cache: "no-store",
  });
}
