import prisma from "@/lib/server/db";
import { Prisma } from "@prisma/client";
export abstract class BaseRepository<T> {
  protected abstract model: any;

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findMany(options?: any): Promise<T[]> {
    return this.model.findMany(options);
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data: { ...data },
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}

export class UserRepository extends BaseRepository<Prisma.UserUncheckedCreateInput> {
  protected model = prisma.user;
}
