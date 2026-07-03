import { app } from '@/app.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Search Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })
    
    it('should be able search a nearby gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
        .post('/gym')
        .set('Authorization', `Bearer ${token}`) 
        .send({
            tittle: 'JavaScript Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -20.529152,
            longitude: -47.4021888
        })

        await request(app.server)
        .post('/gym')
        .set('Authorization', `Bearer ${token}`) 
        .send({
            tittle: 'TypeScript Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -21.1957687,
            longitude: -47.8047271
        })

        const response = await request(app.server)
        .get('/gyms/nearby')
        .query({
            latitude: -20.529152,
            longitude: -47.4021888
        })
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                tittle: 'JavaScript Gym'
            })
        ])
    })
})