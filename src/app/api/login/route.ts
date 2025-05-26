import crypto from "crypto";
import prisma from "@/lib/db";
import { signToken } from "@/lib/auth";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const req = await request.json();
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const { userId, username, email, roles, photo } = req;
  await prisma.refreshTokens.create({
    data: {
      token: refreshToken,
      user_id: userId,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  const accessToken = await signToken({
    userId: userId,
    email: email,
    name: username,
    roles: roles,
    photo: photo,
  });

  const verifiedAccesToken = await verifyToken(accessToken);
  const cookieStore = await cookies();
  const accessCookie = cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 5, // 1 hour in seconds
  });
  const response = new Response('{"message":"success"}', {
    headers: {
      "content-type": "application/json",
      /*"Set-Cookie": `${accessCookie}`,*/
    },
  });
  console.log("response", response);
  return response;
}
