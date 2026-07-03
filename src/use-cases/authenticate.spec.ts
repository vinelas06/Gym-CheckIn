import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.js";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-errors.js";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("Should be able to authenticate user", async () => {
    await usersRepository.create({
      name: "Vinicius",
      email: "viniciusteste@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "viniciusteste@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("Should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "Vinicius",
      email: "viniciusteste@gmail.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "viniciusfonseca553@gmail.com",
        password: "456788",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
