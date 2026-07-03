import { app } from '@/app.js';
import { prisma } from '@/lib/prisma.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Check-In Metrics (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })
    
    it('should be able to count of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()
        
        const gym = await prisma.gym.create({
            data: {
                tittle: 'JavaScript Gym',
                latitude: -20.529152,
                longitude: -47.4021888
            }
        })

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id
                },
                {
                    gym_id: gym.id,
                    user_id: user.id
                }
            ]
        })

        const response = await request(app.server)
        .get('/check-in/metrics')
        .set('Authorization', `Bearer ${token}`) 
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.metrics).toEqual(2)
    })
})