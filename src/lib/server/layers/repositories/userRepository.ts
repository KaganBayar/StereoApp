import { BaseRepository } from "./baseRepository";
import { User, UserAdminEditForm } from "@/lib/shared/Types/userTypes";
import prisma from "@/lib/server/db";
import { formDataList, TypeList } from "@/lib/shared/Types/commonTypes";

export class UserRepository extends BaseRepository<User> {
  protected model = prisma.user;
  protected baseOptions = {
    include: {
      playlists: { include: { playlistSongs: { include: { song: true } } } },
      favorites: { include: { song: true } },
    },
  };

  async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await prisma.user.findFirst({
      where: {
        email,
      },
      ...this.baseOptions,
    });

    return user;
  }
  async checkIfUserIsAdmin(userId: string): Promise<boolean> {
    const user = await this.model.findUnique({
      where: { id: userId },
    });
    if (!user) return false;
    return user.roles.includes("admin");
  }
}
