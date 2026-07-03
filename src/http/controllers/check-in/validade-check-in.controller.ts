import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case.js";

export async function validateCheckInController(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string()
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

    const validateCheckInUseCase = makeValidateCheckInUseCase()
    
    await validateCheckInUseCase.execute({
      checkInId
    });

  return reply.status(204).send();
}
