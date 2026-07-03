import type { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case.js";

export async function metricsController(request: FastifyRequest, reply: FastifyReply) {
    const getMetricsUseCase = makeGetUserMetricsUseCase()
    
    const { metrics } = await getMetricsUseCase.execute({
        userId: request.user.sub
    });

  return reply.status(200).send({
    metrics
  });
}
