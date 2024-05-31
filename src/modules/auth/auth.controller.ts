import { AuthService } from "./auth.service";
import z from "zod";
import { adaptRoute } from "../../route.adapter";

const LoginSchema = z.object({
  body: z.object({
    username: z.string({
      invalid_type_error: "username must be a string type",
      required_error: "username is a required field",
    }),

    password: z.string({
      invalid_type_error: "password must be a string type",
      required_error: "password is a required field",
    }),
  }),
});

const RefreshSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      invalid_type_error: "refreshToken must be a string type",
      required_error: "refreshToken is a required field",
    }),
  }),
});

export const AuthController = {
  login: adaptRoute({
    method: "post",
    path: "/api/v1/auth/login",
    schema: LoginSchema,
    handler: async (req) => {
      const output = await AuthService.login(
        req.body.username,
        req.body.password,
      );

      if (output instanceof Error) {
        return {
          statusCode: 400,
          body: { message: output.message },
        };
      }

      return {
        statusCode: 200,
        body: output,
      };
    },
  }),

  refresh: adaptRoute({
    method: "post",
    path: "/api/v1/auth/refresh",
    schema: RefreshSchema,
    handler: async (req) => {
      const output = await AuthService.refresh(req.body.refreshToken);

      if (output instanceof Error) {
        return {
          statusCode: 400,
          body: { message: output.message },
        };
      }

      return {
        statusCode: 200,
        body: output,
      };
    },
  }),
};
