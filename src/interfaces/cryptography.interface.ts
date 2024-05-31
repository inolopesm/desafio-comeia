export interface PwdHasher {
  hash(password: string): Promise<string>;
}

export interface PwdHashComparer {
  compare(password: string, hash: string): Promise<boolean>;
}

export interface JwtEncrypter {
  encrypt(payload: Record<string, unknown>): Promise<string>;
}

export interface JwtDecrypter {
  decrypt(jwt: string): Promise<Record<string, unknown> | null>;
}
