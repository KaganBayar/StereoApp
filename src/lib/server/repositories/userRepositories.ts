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
}
