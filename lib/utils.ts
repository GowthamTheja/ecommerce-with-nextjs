import jwt, { verify } from "jsonwebtoken";

export function parseToken(
  token: string,
  secret: string
): string | jwt.JwtPayload | null {
  if (!secret) {
    return null;
  }

  const payload = verify(token, secret);
  return payload;
}

export function getItem(key: string): string | null {
  return localStorage.getItem(key);
}

export function setItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}
