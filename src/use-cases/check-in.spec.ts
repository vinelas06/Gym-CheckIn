import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository.js";
import { CheckInUseCase } from "./check-in.js";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym.repository.js";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins.js";
import { MaxDistanceError } from "./errors/max-distance.js";

let CheckInRepository: InMemoryCheckInRepository;
let GymRepository: InMemoryGymRepository
let sut: CheckInUseCase;

describe("Register Use Case", () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInRepository();
    GymRepository = new InMemoryGymRepository();
    sut = new CheckInUseCase(CheckInRepository, GymRepository);

    vi.useFakeTimers()

    await GymRepository.create({
      id: 'gym-01',
      tittle: 'JavaScript Gym',
      description: '',
      phone: '16992144946',
      latitude: new Decimal (-20.529152),
      longitude: new Decimal (-47.4021888)
    })
  });

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -20.529152,
        userLongitude: -47.4021888
    });

    console.log(checkIn.created_at)


    expect(checkIn.id).toEqual(expect.any(String))
  });

  it("should be able create in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -20.529152,
        userLongitude: -47.4021888
    });

    await expect(() => 
    sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -20.529152,
      userLongitude: -47.4021888
    })
  ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  });

  it("should be able check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -20.529152,
        userLongitude: -47.4021888
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -20.529152,
      userLongitude: -47.4021888
    }
  )

  expect(checkIn.id).toEqual(expect.any(String))
  });

  it("should not be able to check in on distance gym", async () => {
    GymRepository.items.push({
      id: 'gym-02',
      tittle: 'TypeScript Gym',
      description: '',
      phone: '16992144946',
      latitude: new Decimal (-21.181638),
      longitude: new Decimal (-47.791596)
    })

    await expect(() => sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: -20.529152,
      userLongitude: -47.4021888
    })
  ).rejects.toBeInstanceOf(MaxDistanceError)
  });
});
