import type { Gym } from "@prisma/client";

export interface FindManyNearbyGymsParams {
    latitude: number;
    longitude: number
}

export interface GymRepository {
    findById(id: string): Promise<Gym | null>
    searchMany(query: string, page: number): Promise<Gym[]>
    findNearby(params: FindManyNearbyGymsParams): Promise<Gym[]>
    create(data: Gym): Promise<Gym>
}