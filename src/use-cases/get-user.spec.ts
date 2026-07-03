import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository.js";
import { GetUserProfileUseCase } from "./get-user.js";
import { hash } from "bcryptjs";
import { ResourseNotFoundError } from "./errors/resourse-not-found-error.js";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able get user profile", async () => {
    const createdUser = await usersRepository.create({
        email: 'johndoe@gmail.com',
        name: 'John Doe',
        password_hash: await hash('12345', 6)
    })

    const { user } = await sut.execute({
        userId: createdUser.id
    })

    expect(user.name).toEqual('John Doe')
  });   

  it("should be able get user profile with wrong id", async () => {
    expect(() => 
        sut.execute({
            userId: 'non-existing-id'
        })
    ).rejects.toBeInstanceOf(ResourseNotFoundError)
  });   
});
