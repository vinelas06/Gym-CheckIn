import { app } from '@/app.js';
import { prisma } from '@/lib/prisma.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Validate CheckIn (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })
        it('should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const user = await prisma.user.findFirstOrThrow()
        
        const gym = await prisma.gym.create({
            data: {
                tittle: 'JavaScript Gym',
                latitude: -20.529152,
                longitude: -47.4021888
            }
        })

        let checkIn = await prisma.checkIn.create({
            data:{
                gym_id: gym.id,
                user_id: user.id
            }
        })

        const response = await request(app.server)
        .patch(`/check-in/${checkIn.id}/validate`)
        .set('Authorization', `Bearer ${token}`) 
        .send()

        expect(response.statusCode).toEqual(204)

        checkIn = await prisma.checkIn.findFirstOrThrow({
            where: {
                id: checkIn.id
            }
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
    })
})