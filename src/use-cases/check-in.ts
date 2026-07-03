import type { CheckInRepository } from "@/repositories/check-in.repository.js";
import type { GymRepository } from "@/repositories/gym.repository.js";
import type { CheckIn } from "@prisma/client";
import { ResourseNotFoundError } from "./errors/resourse-not-found-error.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";
import { MaxDistanceError } from "./errors/max-distance.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins.js";

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymRepository: GymRepository
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourseNotFoundError
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
      )
    
      const MAX_DISTANCE_IN_KILOMETERS = 0.1

      if (distance > MAX_DISTANCE_IN_KILOMETERS) {
        throw new MaxDistanceError()
      }

    const checkInsOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId, 
      new Date()
    )

    if (checkInsOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInRepository.create({
        gym_id: gymId,
        user_id: userId,
    })

    return { checkIn }
  }
}
