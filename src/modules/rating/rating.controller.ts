import { HttpException } from "../../exceptions/http.exception";
import { UUIDPipe } from "../../pipes/uuid.pipe";
import { ZodPipe } from "../../pipes/zod.pipe";
import { AuthPipe } from "../auth/auth.pipe";
import { AuthSwagger } from "../auth/auth.schema";
import { UserSwagger } from "../auth/user.schema";
import { RatingSwagger } from "./rating.schema";
import { RatingService } from "./rating.service";

import {
  UpsertRatingDTO,
  UpsertRatingSchema,
  UpsertRatingSwagger,
} from "./upsert-rating.schema";

import type { Route } from "../../interfaces/route.interface";
import type { SessionDTO } from "../auth/session.schema";

const RatingIdSwagger = {
  in: "path",
  name: "id",
  schema: { type: "string" },
  required: true,
};

export const RatingController = {
  find: {
    method: "get",
    path: "/api/v1/ratings",
    swagger: {
      tags: ["rating"],
      parameters: [AuthSwagger],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: RatingSwagger,
              },
            },
          },
        },
      },
    },
    handler: async (context) => {
      await context.getHeader("authorization", new AuthPipe());
      return await RatingService.find();
    },
  } satisfies Route,

  findOne: {
    method: "get",
    path: "/api/v1/ratings/:id",
    swagger: {
      tags: ["rating"],
      parameters: [AuthSwagger, RatingIdSwagger],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                ...RatingSwagger,
                required: [...RatingSwagger.required, "user"],
                properties: {
                  ...RatingSwagger.properties,
                  user: {
                    ...UserSwagger,
                    required: UserSwagger.required.filter(
                      (value) => value !== "password",
                    ),
                    properties: {
                      ...UserSwagger.properties,
                      password: undefined,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: async (context) => {
      await context.getHeader("authorization", new AuthPipe());
      const id: string = await context.getParam("id", new UUIDPipe("id"));
      const ratingWithUserOrError = await RatingService.findById(id);

      if (ratingWithUserOrError instanceof Error) {
        const error = ratingWithUserOrError;
        throw new HttpException(400, error.message);
      }

      const ratingWithUser = ratingWithUserOrError;
      return ratingWithUser;
    },
  } satisfies Route,

  create: {
    method: "post",
    path: "/api/v1/ratings",
    swagger: {
      tags: ["rating"],
      parameters: [AuthSwagger],
      requestBody: {
        content: {
          "application/json": {
            schema: UpsertRatingSwagger,
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
        },
      },
    },
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
    path: "/api/v1/ratings/{id}",
    swagger: {
      tags: ["rating"],
      parameters: [AuthSwagger, RatingIdSwagger],
      requestBody: {
        content: {
          "application/json": {
            schema: UpsertRatingSwagger,
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
        },
      },
    },
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
    path: "/api/v1/ratings/{id}",
    swagger: {
      tags: ["rating"],
      parameters: [AuthSwagger, RatingIdSwagger],
      responses: { "200": { description: "OK" } },
    },
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
