import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redisClient } from "@/lib/redisClient";
import { NextRequest, NextResponse } from "next/server";

interface Payload {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body = await request.json();

  const { email, password } = body as Payload;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  // validate the email and password
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ message: "Invalid email address" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (password.length < 8) {
    return new Response(JSON.stringify({ message: "Password is too short" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // compare the password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return new Response(JSON.stringify({ message: "Invalid password" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // create a JWT
  const secret = process.env.SECRET;

  if (!secret) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const token = jwt.sign(
    { id: user.id, isAdmin: isAdmin(user.email) },
    secret,
    { expiresIn: "1h" }
  );

  // store the JWT in Redis
  const redis = await redisClient();

  await redis.set(token, user.id, {
    EX: 60 * 60, // 1 hour expiration
  });

  // return the JWT
  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function isAdmin(email: string): boolean {
  return email.split(".")[1] === "admin";
}
