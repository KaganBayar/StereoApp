// scripts/checkUsers.ts
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/server/db";

async function main() {
  const users = await prisma.user.findMany({
    include: {
      playlists: true,
    },
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
