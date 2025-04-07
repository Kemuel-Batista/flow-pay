import { Either, success } from '@/core/either'
import { Account } from '@/domain/payment/enterprise/entities/account'
import { AccountsRepository } from '../../repositories/accounts-repository'

interface GetAccountByUserIdUseCaseRequest {
  userId: string
}

type GetAccountByUserIdUseCaseResponse = Either<
  null,
  {
    account: Account | null
  }
>

export class GetAccountByUserIdUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    userId,
  }: GetAccountByUserIdUseCaseRequest): Promise<GetAccountByUserIdUseCaseResponse> {
    const account = await this.accountsRepository.findByUserId(userId)

    return success({
      account,
    })
  }
}
