import * as jose from "jose";

export async function getToken() {
  if (process.env.JWT_SECRET_KEY == null) {
    throw new Error("JWT_SECRET is not defined");
  } else {
    return process.env.JWT_SECRET;
  }
}

export async function verifyToken(token: string) {
  if (!token) {
    return null;
  } else {
    const verifiedToken = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verifiedToken.payload;
  }
}

export async function signToken(obj: jose.JWTPayload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  const jwt = await new jose.SignJWT(obj)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
  return jwt;
}
