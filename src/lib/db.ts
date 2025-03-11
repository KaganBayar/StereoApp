import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

export async function printAllUsers() {
  const users = await prisma.users.findMany();
  console.log(users);
}

export async function deleteAllUser() {
  prisma.users.deleteMany();
  console.log("All users deleted"); // bir tane bıraıyor nedense
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
