"use server";
import prisma from "@/lib/server/db";
import { Prisma } from "@prisma/client";
import { formDataList, TypeList } from "@/lib/Types/commonTypes";

type genericModel = {
  type: TypeList;
  formData: formDataList;
};
export abstract class BaseRepository<T extends genericModel> {
  protected abstract model: any;
  protected abstract baseOptions: object;
  //

  async findById(id: string, options?: object): Promise<T["type"] | null> {
    return this.model.findUnique({
      where: { id },
      ...options,
      ...this.baseOptions,
    });
  }

  async findMany(options?: object): Promise<T["type"][]> {
    return this.model.findMany({
      ...options,
      ...this.baseOptions,
    });
  }

  async create(data: T["formData"], options?: object): Promise<T["type"]> {
    return this.model.create({ data, ...options, ...this.baseOptions });
  }

  async update(
    id: string,
    data: T["formData"],
    options?: object
  ): Promise<T["type"]> {
    return this.model.update({
      where: { id },
      data: { ...data },
      ...options,
      ...this.baseOptions,
    });
  }

  async delete(id: string, options?: object): Promise<T["type"]> {
    return this.model.delete({
      where: { id },
      ...options,
      ...this.baseOptions,
    });
  }
}
