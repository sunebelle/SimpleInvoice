import type { ZodType } from "zod";

export function parseRequestBody<T>(
  schema: ZodType<T>,
  body: unknown,
): { ok: true; data: T } | { ok: false; error: string } {
  const result = schema.safeParse(body);

  if (!result.success) {
    const issue = result.error.issues[0];
    return { ok: false, error: issue?.message ?? "Validation failed" };
  }

  return { ok: true, data: result.data };
}
