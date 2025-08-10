import * as jose from "jose";
import { Playlists, UserPayload } from "../lib/types";
import { refreshAccessTokenAction } from "@/lib/actions";

export async function signToken(obj: UserPayload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  const jwt = await new jose.SignJWT(obj)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(obj.id)
    .setExpirationTime("10s")
    .sign(secret);
  return jwt;
}
