"use server";
import { BaseRepository } from "./baseRepositories";
import { User, UserAdminEditForm } from "@/lib/Types/userTypes";
import prisma from "@/lib/server/db";
import { formDataList, TypeList } from "@/lib/Types/commonTypes";

type UserModel = {
  type: User;
  formData: UserAdminEditForm;
};
export class UserRepository extends BaseRepository<UserModel> {
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
}
