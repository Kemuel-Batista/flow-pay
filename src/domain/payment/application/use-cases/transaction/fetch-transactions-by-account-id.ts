import { Either, failure, success } from '@/core/either'
import { AccountsRepository } from '../../repositories/accounts-repository'
import { TransactionsRepository } from '../../repositories/transactions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface FetchTransactionsByAccountIdUseCaseRequest {
  accountId: string
  userId: string
}

type FetchTransactionsByAccountIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    transactions: Transaction[]
  }
>

@Injectable()
export class FetchTransactionsByAccountIdUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    accountId,
    userId,
  }: FetchTransactionsByAccountIdUseCaseRequest): Promise<FetchTransactionsByAccountIdUseCaseResponse> {
    const account = await this.accountsRepository.findById(accountId)

    if (!account) {
      return failure(new ResourceNotFoundError())
    }

    if (account.userId.toString() !== userId) {
      return failure(new NotAllowedError())
    }

    const transactions =
      await this.transactionsRepository.findManyByAccountId(accountId)

    return success({
      transactions,
    })
  }
}
