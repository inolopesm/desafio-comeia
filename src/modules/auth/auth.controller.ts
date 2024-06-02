import { HttpException } from "../../exceptions/http.exception";
import { JWTPipe } from "../../pipes/jwt.pipe";
import { ZodPipe } from "../../pipes/zod.pipe";
import { REFRESH_TOKEN_SECRET } from "./auth.constants";
import { AuthSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { LoginDTO, LoginSchema } from "./login.schema";
import { SessionDTO, SessionSchema } from "./session.schema";
import type { Route } from "../../interfaces/route.interface";

export const AuthController = {
  login: {
    method: "post",
    path: "/api/v1/auth/login",
    swagger: {
      tags: ["auth"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string" },
                password: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["accessToken", "refreshToken"],
                properties: {
                  accessToken: { type: "string" },
                  refreshToken: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    handler: async (context) => {
      const { username, password }: LoginDTO = await context.getBody(
        new ZodPipe(LoginSchema),
      );

      const resultOrError = await AuthService.login(username, password);

      if (resultOrError instanceof Error) {
        const error = resultOrError;
        throw new HttpException(400, error.message);
      }

      const result = resultOrError;

      return result;
    },
  } satisfies Route,

  refresh: {
    method: "post",
    path: "/api/v1/auth/refresh",
    swagger: {
      tags: ["auth"],
      parameters: [
        {
          in: "header",
          name: "Authorization",
          schema: { type: "string" },
          required: true,
        },
      ],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["accessToken"],
                properties: {
                  accessToken: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    handler: async (context) => {
      const sessionDTO: SessionDTO = await context.getHeader(
        "authorization",
        new ZodPipe(AuthSchema, 401, "unauthorized"),
        new JWTPipe(REFRESH_TOKEN_SECRET, 401, "unauthorized"),
        new ZodPipe(SessionSchema, 401, "unauthorized"),
      );

      const accessToken = await AuthService.refresh(sessionDTO);

      return { accessToken };
    },
  } satisfies Route,
};
