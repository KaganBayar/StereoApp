import { Artist, ArtistFormData } from "../../../Types/artistTypes";
import { BaseRepository } from "./baseRepository";
import prisma from "@/lib/server/db";

export class ArtistRepository extends BaseRepository<Artist> {
  protected model = prisma.artist;
  protected baseOptions = {
    include: { albums: true, songs: true },
  };
}
