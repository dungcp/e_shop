import bcrypt from "bcrypt";

import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    // User with the same email already exists, return an error response
    return NextResponse.json(
      { error: "User with the same email already exists" },
      { status: 400 }
    );
  }
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });
  console.log("user", user);

  return NextResponse.json(user);
}
