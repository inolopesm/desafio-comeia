import crypto from "node:crypto";
import jose from "jose";
import z from "zod";
import type { Controller, Request, Response } from "@/interfaces";
import type { SessionDTO } from "../../auth/session.dto";
import type { Rating } from "../rating.entity";
import type { CreateRatingRepository } from "./create-rating.repository";

export class CreateRatingController implements Controller {
  private static readonly accessTokenSchema = z
    .string()
    .min(1)
    .startsWith("Bearer ")
    .transform((value) => value.slice("Bearer ".length));

  private static readonly jwtPayloadSchema = z.object({ userId: z.string() });

  private static readonly requestBodySchema = z.object({ userId: z.string() });

  private readonly createRatingRepository: CreateRatingRepository;
  private readonly jwtAccessSecret: Uint8Array;

  constructor(
    createRatingRepository: CreateRatingRepository,
    jwtAccessSecret: string,
  ) {
    this.createRatingRepository = createRatingRepository;
    this.jwtAccessSecret = new TextEncoder().encode(jwtAccessSecret);
  }

  async handle(req: Request): Promise<Response> {
    const { authorization } = req.headers;

    const accessToken =
      await CreateRatingController.accessTokenSchema.parseAsync(
        req.headers.authorization,
      );

    const { payload: jwtPayload } = await jose
      .jwtDecrypt(
        await CreateRatingController.accessTokenSchema.parseAsync(
          req.headers.authorization,
        ),
        this.jwtAccessSecret,
      )
      .then(({ payload }) => payload);

    const { userId } = await z
      .object({ userId: z.string() })
      .parseAsync(payload);

    /* eslint-disable prettier/prettier */
    const { rating, comment } = await z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().min(1).max(255),
    }).parseAsync(req.body);
    /* eslint-enable prettier/prettier */

    const entity: Rating = {
      id: crypto.randomUUID(),
      userId,
      rating,
      comment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this.createRatingRepository.create(entity);
    return { body: entity };
  }
}
