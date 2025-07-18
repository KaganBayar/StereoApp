import * as jose from "jose";
import { Playlists } from "../lib/types";
import { refreshAccessTokenAction } from "@/lib/actions";

//BUNU TAMAMEN SERVER ACTIONA ÇEK
/*
export async function verifyToken(token: string) {
  if (!token) {
    throw new Error("Token is required for verification");
    return null;
  } else {
    try {
      const verifiedToken = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY),
        {
          algorithms: ["HS256"],
        }
      );
      console.log("VERIFIED");
      return verifiedToken.payload;
    } catch (e) {
      if (e instanceof jose.errors.JWTExpired) {
        try {
          await refreshAccessTokenAction(token);
          return await verifyToken(token);
        } catch (error) {
          throw new Error("Failed to refresh access token: " + error);
        }
      } else {
        throw new Error("Token verification failed: " + e);
      }
    }
  }
}
*/

export async function signToken(obj: jose.JWTPayload & { userId: string }) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  const jwt = await new jose.SignJWT(obj)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(obj.userId)
    .setExpirationTime("10s")
    .sign(secret);
  return jwt;
}
