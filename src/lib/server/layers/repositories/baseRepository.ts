import { formDataList, TypeList } from "@/lib/Types/commonTypes";

export abstract class BaseRepository<T extends TypeList> {
  protected abstract model: any;
  protected abstract baseOptions: object;
  //

  async findById(id: string, options?: object): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      ...options,
      ...this.baseOptions,
    });
  }

  async findMany(options?: object): Promise<T[]> {
    return this.model.findMany({
      ...options,
      ...this.baseOptions,
    });
  }

  async create(data: Partial<T>, options?: object): Promise<T> {
    return this.model.create({ data, ...options, ...this.baseOptions });
  }

  async update(id: string, data: Partial<T>, options?: object): Promise<T> {
    return this.model.update({
      where: { id },
      data: { ...data },
      ...options,
      ...this.baseOptions,
    });
  }

  async delete(id: string, options?: object): Promise<T> {
    return this.model.delete({
      where: { id },
      ...options,
      ...this.baseOptions,
    });
  }

  async deleteMany(id: string, options?: object): Promise<void> {
    await this.model.deleteMany({
      where: { id },
      ...options,
      ...this.baseOptions,
    });
  }
}
