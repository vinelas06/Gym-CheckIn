import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository.js";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.js";

let CheckInRepository: InMemoryCheckInRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Register Use Case", () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryUseCase(CheckInRepository);
  });


  it("should be able to fetch check in history", async () => {
    await CheckInRepository.create({
        gym_id: 'gym-1',
        user_id: 'user-1'
    })

    await CheckInRepository.create({
        gym_id: 'gym-2',
        user_id: 'user-1'
    })

    const { checkIns } = await sut.execute({
        userId: 'user-1',
        page: 1
    });

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
        expect.objectContaining({ gym_id: 'gym-1' }),
        expect.objectContaining({ gym_id: 'gym-2' })
    ])
  });

  it("should be able to fetch check in history", async () => {

    for (let i = 1; i <= 22; i++) {
        await CheckInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-1'
    })
    }

    const { checkIns } = await sut.execute({
        userId: 'user-1',
        page: 2
    });

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
        expect.objectContaining({ gym_id: 'gym-21' }),
        expect.objectContaining({ gym_id: 'gym-22' })
    ])
  });
});
