"use server";
import { BaseRepository } from "./baseRepositories";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import prisma from "@/lib/server/db";

type AlbumModel = {
  type: Album;
  formData: AlbumFormData;
};
export class AlbumRepositories extends BaseRepository<AlbumModel> {
  protected model = prisma.album;
  protected baseOptions = {
    include: { artist: true, songs: true },
  };
}
