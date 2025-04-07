import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotEnoughBalanceError } from './errors/not-enough-balance-error'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TransactionsRepository } from '../../repositories/transactions-repository'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { AccountsRepository } from '../../repositories/accounts-repository'

interface CreateDefaultTransactionUseCaseRequest {
  value: number
  type: number
  userId: string
}

type CreateDefaultTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | NotEnoughBalanceError,
  null
>

export class CreateDefaultTransactionUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    value,
    type,
    userId,
  }: CreateDefaultTransactionUseCaseRequest): Promise<CreateDefaultTransactionUseCaseResponse> {
    const account = await this.accountsRepository.findByUserId(userId)

    if (!account) {
      return failure(new ResourceNotFoundError())
    }

    const balance = await this.accountsRepository.getBalance(userId)

    if (type === TransactionType.EXIT && balance < value) {
      return failure(new NotEnoughBalanceError())
    }

    const transaction = Transaction.create({
      type,
      value,
      accountId: account.id,
      userId: new UniqueEntityID(userId),
    })

    await this.transactionsRepository.create(transaction)

    return success(null)
  }
}
