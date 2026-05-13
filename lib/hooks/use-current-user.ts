"use client";

import { useCallback, useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  branch: string;
  name: string;
}

interface UseCurrentUserResult {
  user: CurrentUser | null;
  loading: boolean;
  error: "unauthorized" | "network" | null;
  refetch: () => void;
}

/**
 * Single source of truth for "who is the logged-in user?" on the client.
 *
 * Hits /api/auth/me, which reads the HTTP-only session cookie. We never
 * read auth state from localStorage — that's why we can't make the cookie
 * httpOnly elsewhere and still have JS access.
 *
 * The cookie is sent automatically because the request is same-origin;
 * `credentials: "include"` is included for explicitness.
 */
interface State {
  user: CurrentUser | null;
  loading: boolean;
  error: "unauthorized" | "network" | null;
}

const INITIAL_STATE: State = { user: null, loading: true, error: null };

export function useCurrentUser(): UseCurrentUserResult {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          const data = (await res.json()) as { user: CurrentUser };
          setState({ user: data.user, loading: false, error: null });
        } else {
          setState({ user: null, loading: false, error: "unauthorized" });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState({ user: null, loading: false, error: "network" });
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    setVersion((x) => x + 1);
  }, []);

  return { ...state, refetch };
}
