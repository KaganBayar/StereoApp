"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import crypto from "crypto";
import { cookies } from "next/headers";
const formRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

const formLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function register(formData: FormData) {
  console.log(formData);
  const data = formRegisterSchema.parse(Object.fromEntries(formData));
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  console.log("registered");
  console.log(
    await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    })
  );
}

export async function login(formData: FormData) {
  const data = formLoginSchema.parse(Object.fromEntries(formData));
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new Error("Password incorrect");
  }
  const hash = crypto.createHash("sha256").update("mystring").digest("hex");
  const oneDay = 60 - 60 * 24;
  prisma.user.update({ where: { id: user.id }, data: { sessions: hash } });
  const responseCookies = cookies();
  responseCookies.set("session", hash, {
    expires: new Date(Date.now() + oneDay * 1000),
  });
  responseCookies.set("user", user.name, {
    expires: new Date(Date.now() + oneDay * 1000),
  });
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  return user;
}
