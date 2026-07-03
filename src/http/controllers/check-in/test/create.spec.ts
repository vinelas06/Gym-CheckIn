import { app } from '@/app.js';
import { prisma } from '@/lib/prisma.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Create CheckIn (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })
    
    it('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app)
        
        const gym = await prisma.gym.create({
            data: {
                tittle: 'JavaScript Gym',
                latitude: -20.529152,
                longitude: -47.4021888
            }
        })

         await request(app.server)
        .post('/user').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const response = await request(app.server)
        .post(`/gyms/${gym.id}/check-in`)
        .set('Authorization', `Bearer ${token}`) 
        .send({
        latitude: -20.529152,
        longitude: -47.4021888
        })

        expect(response.statusCode).toEqual(201)
    })
})