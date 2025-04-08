import { Either, failure, success } from '@/core/either'
import { AccountsRepository } from '../../repositories/accounts-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface GetAccountBalanceUseCaseRequest {
  id: string
  userId: string
}

type GetAccountBalanceUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    amount: number
  }
>

@Injectable()
export class GetAccountBalanceUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    id,
    userId,
  }: GetAccountBalanceUseCaseRequest): Promise<GetAccountBalanceUseCaseResponse> {
    const account = await this.accountsRepository.findById(id)

    if (!account) {
      return failure(new ResourceNotFoundError())
    }

    if (account.userId.toString() !== userId) {
      return failure(new NotAllowedError())
    }

    const currentBalance = await this.accountsRepository.getBalance(id)

    return success({
      amount: currentBalance,
    })
  }
}
