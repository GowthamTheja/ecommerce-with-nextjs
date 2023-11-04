import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface Payload {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body = await request.json();

  const { username, email, password } = body as Payload;

  if (!username || !email || !password) {
    return new Response(
      JSON.stringify({ message: "Username, email and password are required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
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

  if (user) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 409,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create the user
  const newUser = await prisma.users.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.redirect(`${process.env.HOST}/login`);
}
