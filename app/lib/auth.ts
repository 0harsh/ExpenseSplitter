import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const DEFAULT_JWT_EXPIRES = "7d";

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

type JwtPayload = {
  sub: string; // user id
  email: string;
};

export function signAuthToken(
  payload: JwtPayload,
  options?: { expiresIn?: string | number }
): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return jwt.sign(payload, secret, { expiresIn: options?.expiresIn ?? DEFAULT_JWT_EXPIRES });
}

export function verifyAuthToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return jwt.verify(token, secret) as JwtPayload;
}

export function authCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: "auth_token",
    options: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
      // max-age handled by JWT expiry; you can set an upper bound if desired
    },
  };
}


