import { Either, success } from '@/core/either'
import { AccountsRepository } from '../../repositories/accounts-repository'

interface GetAccountBalanceUseCaseRequest {
  id: string
}

type GetAccountBalanceUseCaseResponse = Either<
  null,
  {
    amount: number
  }
>

export class GetAccountBalanceUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    id,
  }: GetAccountBalanceUseCaseRequest): Promise<GetAccountBalanceUseCaseResponse> {
    const currentBalance = await this.accountsRepository.getBalance(id)

    return success({
      amount: currentBalance,
    })
  }
}
