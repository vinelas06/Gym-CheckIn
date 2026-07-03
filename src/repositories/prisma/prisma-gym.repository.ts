import type { Gym } from "@prisma/client";
import type { FindManyNearbyGymsParams, GymRepository } from "../gym.repository.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaGymRepository implements GymRepository {
    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id
            }
        })

        return gym
    }
    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                tittle: {
                    contains: query
                }
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return gyms
    }
    async findNearby({ latitude, longitude }: FindManyNearbyGymsParams) {
        const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `

        return gyms
    }
    async create(data: Gym) {
        const gym = await prisma.gym.create({
            data: data
        })

        return gym
    }

}