import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-check-ins-history-use-case.js";

export async function getHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const getHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  });

  const userId = request.user.sub

  const { page } = getHistoryQuerySchema.parse(request.query);

    const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()
    
    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
        userId, 
        page
    });

  return reply.status(200).send({
    checkIns
  });
}
