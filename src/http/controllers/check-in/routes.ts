import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { validateCheckInController } from "./validade-check-in.controller.js";
import { metricsController } from "./metrics.controller.js";
import { getHistoryController } from "./history.controller.js";
import { createCheckInController } from "./create-check-in.controller.js";
import type { FastifyInstance } from "fastify";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.js";

export async function checkInRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.patch('/check-in/:checkInId/validate', { onRequest: [verifyUserRole("ADMIN")] }, validateCheckInController)
    app.get('/check-in/metrics', metricsController)
    app.get('/check-in/history', getHistoryController)

    app.post('/gyms/:gymId/check-in', createCheckInController)
}