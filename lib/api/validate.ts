// Standard wrapper for parsing + validating a JSON request body with Zod.
// Returns either { ok: true, data } or { ok: false, response } — never
// throws. The response is a 400 with our consistent error shape, so route
// handlers can just forward it.

import type { NextRequest } from "next/server";
import { z, type ZodSchema } from "zod";
import { badRequest, validationFailed } from "./errors";

type ParseSuccess<T> = { ok: true; data: T };
type ParseFailure = { ok: false; response: ReturnType<typeof badRequest> };
export type ParseResult<T> = ParseSuccess<T> | ParseFailure;

export async function parseJsonBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<ParseResult<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, response: badRequest("Request body is not valid JSON") };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    const message = first
      ? `${first.path.length > 0 ? first.path.join(".") + ": " : ""}${first.message}`
      : "Invalid request body";
    return {
      ok: false,
      response: validationFailed(message, result.error.issues),
    };
  }

  return { ok: true, data: result.data };
}

// Re-export so route files can import everything from one place.
export { z };
