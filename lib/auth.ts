import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { redisClient } from "./redisClient";
import { parseToken } from "./utils";
import Link from "next/link";

export const getToken = (request: NextRequest): string | undefined => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return undefined;
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return undefined;
  }
  return token;
};

export const tokenIsValid = async (request: NextRequest): Promise<boolean> => {
  const token = getToken(request);
  if (!token) {
    return false;
  }

  const secret = process.env.SECRET;

  if (!secret) {
    return false;
  }

  const redisAuth = await (await redisClient()).get(token);

  if (!redisAuth) {
    return false;
  }

  const payload = parseToken(token, secret);

  if (!payload) {
    return false;
  }

  return true;
};

export const isAuthenticated = async (
  request: NextRequest
): Promise<boolean> => {
  return await tokenIsValid(request);
};
