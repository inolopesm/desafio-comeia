import argon2 from "argon2";
import z from "zod";
import jose from "jose";
import { BadRequestException } from "@/exceptions/bad-request.exception";
import type { Controller } from "@/interfaces/controller.interface";
import type { Request, Response } from "@/interfaces/http.interface";
import type { FindUserByUsernameRepository } from "@/modules/user/find-by-username/find-user-by-username.repository";
import type { SessionDTO } from "../session.dto";

export interface LoginRequestBody {
  username: string;
  password: string;
}

export class LoginController implements Controller {
  private readonly findUserByUsernameRepository: FindUserByUsernameRepository;
  private readonly jwtAccessSecret: Uint8Array;
  private readonly jwtRefreshSecret: Uint8Array;

  constructor(
    findUserByUsernameRepository: FindUserByUsernameRepository,
    jwtAccessSecret: string,
    jwtRefreshSecret: string,
  ) {
    this.findUserByUsernameRepository = findUserByUsernameRepository;
    this.jwtAccessSecret = new TextEncoder().encode(jwtAccessSecret);
    this.jwtRefreshSecret = new TextEncoder().encode(jwtRefreshSecret);
  }

  async handle(req: Request): Promise<Response> {
    const { username, password } = await z
      .object({ username: z.string(), password: z.string() })
      .parseAsync(req.body);

    const user =
      await this.findUserByUsernameRepository.findByUsername(username);

    if (user === null) {
      throw new BadRequestException("usuário não encontrado");
    }

    const passwordMatch = argon2.verify(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException("senha incorreta");
    }

    const payload: SessionDTO = { userId: user.id };

    const signJWT = new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt();

    const acessToken = await signJWT
      .setExpirationTime("5 minutes")
      .sign(this.jwtAccessSecret);

    const refreshToken = await signJWT
      .setExpirationTime("1 day")
      .sign(this.jwtAccessSecret);

    return { body: { acessToken, refreshToken } };
  }
}
