import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository.js";
import { GetUserMetricsUseCase } from "./get-user-metrics.js";

let CheckInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics UseCase", () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(CheckInRepository);
  });


  it("should be able get check-ins count from metrics", async () => {
    await CheckInRepository.create({
        gym_id: 'gym-1',
        user_id: 'user-1'
    })

    await CheckInRepository.create({
        gym_id: 'gym-2',
        user_id: 'user-1'
    })

    const { metrics } = await sut.execute({
        userId: 'user-1',
    });

    expect(metrics).toEqual(2)
  });
});
