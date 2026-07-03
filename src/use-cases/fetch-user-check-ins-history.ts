import type { CheckInRepository } from "@/repositories/check-in.repository.js";
import type { CheckIn } from "@prisma/client";

interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string;
    page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
  ) {}

  async execute({
    userId,
    page
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInRepository.fetchManyByUserId(userId, page)

    return { checkIns }
  }
}
