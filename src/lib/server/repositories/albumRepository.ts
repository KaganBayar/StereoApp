"use server";
import { BaseRepository } from "./baseRepository";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import prisma from "@/lib/server/db";

type AlbumModel = {
  type: Album;
  formData: AlbumFormData;
};
export class AlbumRepository extends BaseRepository<AlbumModel> {
  protected model = prisma.album;
  protected baseOptions = {
    include: { artist: true, songs: true },
  };
}
