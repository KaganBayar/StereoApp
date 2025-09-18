"use server";
import { Artist, ArtistFormData } from "../../Types/artistTypes";
import { BaseRepository } from "./baseRepositories";
import prisma from "@/lib/server/db";

type ArtistModel = {
  type: Artist;
  formData: ArtistFormData;
};

export class ArtistRepositories extends BaseRepository<ArtistModel> {
  protected model = prisma.artist;
  protected baseOptions = {
    include: { albums: true, songs: true },
  };
}
