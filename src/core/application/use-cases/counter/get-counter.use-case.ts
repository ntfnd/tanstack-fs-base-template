import { Counter } from "@/core/domain/entities"
import { CounterRepository } from "@/core/domain/repositories"

export interface GetCounterRequest {
    counterId?: string
}

export interface GetCounterResponse {
    counter: Counter
}

export interface IGetCounterUseCase {
    execute(request?: GetCounterRequest): Promise<GetCounterResponse>
}

export class GetCounterUseCase implements IGetCounterUseCase {
    constructor(private readonly counterRepository: CounterRepository) {}

    async execute(request: GetCounterRequest = {}): Promise<GetCounterResponse> {
        if (!request.counterId) {
            const defaultCounter = await this.counterRepository.getDefault()

            return { counter: defaultCounter }
        }

        const counter = await this.counterRepository.getById(request.counterId)

        if (!counter) {
            throw new Error(`Counter with id ${request.counterId} not found`)
        }

        return { counter }
    }
}
