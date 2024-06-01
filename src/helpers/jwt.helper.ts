import * as jose from "jose";

export const JWTHelper = {
  async encrypt(
    payload: Record<string, unknown>,
    secret: string,
    expirationTime: string,
  ) {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(new TextEncoder().encode(secret));
  },

  async decrypt(jwt: string, secret: string) {
    try {
      const key = new TextEncoder().encode(secret);
      const { payload } = await jose.jwtVerify(jwt, key);
      return payload;
    } catch (error) {
      if (error instanceof jose.errors.JWSSignatureVerificationFailed)
        return new Error("jwt signature verification failed");

      if (error instanceof jose.errors.JWTExpired)
        return new Error("jwt expired");

      if (error instanceof jose.errors.JWSInvalid)
        return new Error("jws invalid");

      throw error;
    }
  },
};
