import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  branch: string;
  name: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("auth_token")?.value;

    if (!token) {
      const headersList = await headers();
      const authHeader = headersList.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export function requireAuth(requiredRole?: string) {
  return async (user: AuthUser | null) => {
    if (!user) {
      throw new Error("Unauthorized");
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new Error("Forbidden");
    }

    return user;
  };
}

