// Consistent JSON error shape for every API route.
//
//   { "error": "<human-readable>", "code": "<machine-readable>" }
//
// Status codes follow standard HTTP semantics:
//   400 — validation / bad request
//   401 — no/invalid session
//   403 — authenticated but not permitted
//   404 — not found
//   429 — rate limited
//   500 — unexpected server error
//
// Clients should branch on `code`, never on the human-readable `error`
// string. The strings can be re-worded freely; codes are part of the API
// contract.

import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "validation_failed"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "bad_request"
  | "internal_error";

interface ApiErrorBody {
  error: string;
  code: ApiErrorCode;
  details?: unknown;
}

export function apiError(
  status: number,
  body: ApiErrorBody
): NextResponse<ApiErrorBody> {
  return NextResponse.json(body, { status });
}

export function badRequest(message: string, details?: unknown) {
  return apiError(400, {
    error: message,
    code: "bad_request",
    ...(details !== undefined ? { details } : {}),
  });
}

export function validationFailed(message: string, details?: unknown) {
  return apiError(400, {
    error: message,
    code: "validation_failed",
    ...(details !== undefined ? { details } : {}),
  });
}

export function unauthorized(message = "Unauthorized") {
  return apiError(401, { error: message, code: "unauthorized" });
}

export function forbidden(message = "Forbidden") {
  return apiError(403, { error: message, code: "forbidden" });
}

export function notFound(message = "Not found") {
  return apiError(404, { error: message, code: "not_found" });
}

export function conflict(message: string) {
  return apiError(409, { error: message, code: "conflict" });
}

export function rateLimited(message = "Too many requests") {
  return apiError(429, { error: message, code: "rate_limited" });
}

export function internalError(message = "Internal server error") {
  return apiError(500, { error: message, code: "internal_error" });
}
