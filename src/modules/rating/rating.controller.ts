import { HttpException } from "../../exceptions/http.exception";
import { UUIDPipe } from "../../pipes/uuid.pipe";
import { ZodPipe } from "../../pipes/zod.pipe";
import { AuthPipe } from "../auth/auth.pipe";
import { RatingService } from "./rating.service";
import { UpsertRatingDTO, UpsertRatingSchema } from "./upsert-rating.schema";
import type { Route } from "../../interfaces/route.interface";
import type { SessionDTO } from "../auth/session.schema";

export const RatingController = {
  find: {
    method: "get",
    path: "/api/v1/ratings",
    handler: async (context) => {
      await context.getHeader("authorization", new AuthPipe());
      return await RatingService.find();
    },
  } satisfies Route,

  create: {
    method: "post",
    path: "/api/v1/ratings",
    handler: async (context) => {
      const { userId }: SessionDTO = await context.getHeader(
        "authorization",
        new AuthPipe(),
      );

      const { rating, comment }: UpsertRatingDTO = await context.getBody(
        new ZodPipe(UpsertRatingSchema),
      );

      const error = await RatingService.create(userId, rating, comment);

      if (error instanceof Error) {
        throw new HttpException(400, error.message);
      }
    },
  } satisfies Route,

  update: {
    method: "put",
    path: "/api/v1/ratings/:id",
    handler: async (context) => {
      const id: string = await context.getParam("id", new UUIDPipe("id"));

      const { userId }: SessionDTO = await context.getHeader(
        "authorization",
        new AuthPipe(),
      );

      const { rating, comment }: UpsertRatingDTO = await context.getBody(
        new ZodPipe(UpsertRatingSchema),
      );

      const error = await RatingService.updateByIdAndUserId(
        id,
        userId,
        rating,
        comment,
      );

      if (error instanceof Error) {
        throw new HttpException(400, error.message);
      }
    },
  } satisfies Route,

  delete: {
    method: "delete",
    path: "/api/v1/ratings/:id",
    handler: async (context) => {
      const id: string = await context.getParam("id", new UUIDPipe("id"));

      const { userId }: SessionDTO = await context.getHeader(
        "authorization",
        new AuthPipe(),
      );

      const error = await RatingService.deleteByIdAndUserId(id, userId);

      if (error instanceof Error) {
        throw new HttpException(400, error.message);
      }
    },
  } satisfies Route,
};
