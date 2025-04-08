import { Either, failure, success } from '@/core/either'
import { Account } from '@/domain/payment/enterprise/entities/account'
import { AccountsRepository } from '../../repositories/accounts-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface GetAccountByUserIdUseCaseRequest {
  userId: string
}

type GetAccountByUserIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    account: Account
  }
>

@Injectable()
export class GetAccountByUserIdUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    userId,
  }: GetAccountByUserIdUseCaseRequest): Promise<GetAccountByUserIdUseCaseResponse> {
    const account = await this.accountsRepository.findByUserId(userId)

    if (!account) {
      return failure(new ResourceNotFoundError())
    }

    return success({
      account,
    })
  }
}
