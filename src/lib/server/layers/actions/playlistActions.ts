"use server";

import { PlaylistService } from "../services/playlistService";
import { container } from "../../DI_container/container";
import { Playlist } from "@/lib/Types/playlistTypes";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { auth } from "../../../../../config/firebase";

const playlistService = container.playlistService;
const userService = container.userService;

export async function createPlaylist(
  id: string,
  data: Partial<Playlist>
): Promise<Playlist> {
  const user = await authMiddleware.requireValidUser();
  if (!user) throw new Error("User not authenticated");

  if (await userService.isUserAdmin(user.id)) {
    return playlistService.createPlaylist(data);
  }

  if (id !== user.id) {
    throw new Error("You can only create playlists for yourself");
  }
  return playlistService.createPlaylist(data);
}

export async function updatePlaylist(
  id: string,
  data: Partial<Playlist>
): Promise<Playlist> {
  const user = await authMiddleware.requireValidUser();

  if (!user) throw new Error("User not authenticated");
  const playlist = await playlistService.getPlaylistById(id);

  if (!playlist) throw new Error("Playlist not found");

  if (await userService.isUserAdmin(user.id)) {
    return playlistService.updatePlaylist(id, data);
  }

  if (playlist.user_id !== user.id) {
    throw new Error("You can only update your own playlists");
  }

  return playlistService.updatePlaylist(id, data);
}

export async function deletePlaylist(id: string): Promise<Playlist> {
  const user = await authMiddleware.requireValidUser();

  if (!user) throw new Error("User not authenticated");
  const playlist = await playlistService.getPlaylistById(id);

  if (!playlist) throw new Error("Playlist not found");

  if (await userService.isUserAdmin(user.id)) {
    return playlistService.deletePlaylist(id);
  }

  if (playlist.user_id !== user.id) {
    throw new Error("You can only delete your own playlists");
  }

  return playlistService.deletePlaylist(id);
}

export async function deleteManyPlaylists(ids: string[]): Promise<void> {
  //for now it is admin only
  const user = await authMiddleware.requireAdminUser();
  return playlistService.deleteManyPlaylists(ids);
}

export async function getPlaylistById(id: string): Promise<Playlist | null> {
  return playlistService.getPlaylistById(id);
}

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  return playlistService.getUserPlaylists(userId);
}

export async function addSongToPlaylist(playlistId: string, songId: string) {
  const user = await authMiddleware.requireValidUser();

  if (!user) throw new Error("User not authenticated");
  const playlist = await playlistService.getPlaylistById(playlistId);

  if (!playlist) throw new Error("Playlist not found");

  if (await userService.isUserAdmin(user.id)) {
    return playlistService.addSongToPlaylist(playlistId, songId);
  }

  if (playlist.user_id !== user.id) {
    throw new Error("You can only add songs to your own playlists");
  }

  return playlistService.addSongToPlaylist(playlistId, songId);
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
) {
  const user = await authMiddleware.requireValidUser();

  if (!user) throw new Error("User not authenticated");
  const playlist = await playlistService.getPlaylistById(playlistId);

  if (!playlist) throw new Error("Playlist not found");

  if (await userService.isUserAdmin(user.id)) {
    return playlistService.removeSongFromPlaylist(playlistId, songId);
  }

  if (playlist.user_id !== user.id) {
    throw new Error("You can only remove songs from your own playlists");
  }

  return playlistService.removeSongFromPlaylist(playlistId, songId);
}
