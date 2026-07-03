import type { CheckInRepository } from "@/repositories/check-in.repository.js";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  metrics: number;
}

export class GetUserMetricsUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
  ) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const metrics = await this.checkInRepository.countByUserId(userId)

    return { metrics }
  }
}
