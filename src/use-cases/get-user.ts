import type { UsersRepository } from "@/repositories/users.repository.js";
import { ResourseNotFoundError } from "./errors/resourse-not-found-error.js";
import type { User } from "@prisma/client";

interface getUserProfileUseCaseProps {
    userId: string;
}

interface getUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(
        private readonly userRepository: UsersRepository
    ) {}

    async execute({
        userId
    }: getUserProfileUseCaseProps): Promise<getUserProfileUseCaseResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ResourseNotFoundError()
        }

        return { user }
    }
}