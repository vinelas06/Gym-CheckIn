import type { CheckIn, Prisma } from "@prisma/client";

export interface CheckInRepository {
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    fetchManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    findById(id: string): Promise<CheckIn | null>
    countByUserId(userId: string): Promise<number>
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(checkIn: CheckIn): Promise<CheckIn>
}