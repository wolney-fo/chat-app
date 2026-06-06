import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function sendMessage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/chats/:chatId/messages",
    {
      schema: {
        params: z.object({
          chatId: z.uuid(),
        }),
        body: z.object({
          content: z.string().nonempty(),
        }),
      },
    },
    async (request, reply) => {
      const { chatId } = request.params;
      const { content } = request.body;

      return reply.status(204);
    },
  );
}
