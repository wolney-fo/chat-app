import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { routes } from "./http/routes";
import { env } from "./env";
import fastifyWebsocket from "@fastify/websocket";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";

export const app = fastify();

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCookie);

app.register(fastifyWebsocket);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "ChatApp",
      description: "API for ChatApp, a real-time messaging web platform.",
      version: "0.2.0",
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication and session management.",
      },
      {
        name: "Users",
        description: "User accounts and profiles.",
      },
      {
        name: "Chats",
        description: "Chat conversations.",
      },
      {
        name: "Messages",
        description: "Sending and receiving chat messages.",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/openapi",
});

app.register(routes);
