import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";

const ACCESS_EXPIRES = "7d"; // 7 days token expiration per BRD spec
const ACCESS_SECRET = process.env.ACCESS_SECRET || "access-secret-key-change-in-production";

export interface TokenPayload {
  userId: string;
  username: string;
}

export interface AccessTokenPayload extends TokenPayload, JwtPayload {}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
