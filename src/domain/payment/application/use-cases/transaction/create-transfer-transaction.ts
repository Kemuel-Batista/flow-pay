import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AccountsRepository } from '../../repositories/accounts-repository'
import { TransactionsRepository } from '../../repositories/transactions-repository'
import { NotEnoughBalanceError } from './errors/not-enough-balance-error'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateTransferTransactionUseCaseRequest {
  bankNumber: string
  agencyNumber: string
  accountNumber: string
  value: number
  description?: string
  userId: string
}

type CreateTransferTransactionUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export class CreateTransferTransactionUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    bankNumber,
    agencyNumber,
    accountNumber,
    value,
    description,
    userId,
  }: CreateTransferTransactionUseCaseRequest): Promise<CreateTransferTransactionUseCaseResponse> {
    const transferAccount =
      await this.accountsRepository.findByAccountInformation(
        bankNumber,
        agencyNumber,
        accountNumber,
      )

    if (!transferAccount) {
      return failure(new ResourceNotFoundError())
    }

    const account = await this.accountsRepository.findByUserId(userId)

    if (!account) {
      return failure(new ResourceNotFoundError())
    }

    const balance = await this.accountsRepository.getBalance(userId)

    if (balance < value) {
      return failure(new NotEnoughBalanceError())
    }

    const exitTransaction = Transaction.create({
      type: TransactionType.EXIT,
      value,
      userId: new UniqueEntityID(userId),
      accountId: account.id,
      description,
    })

    const entryTransaction = Transaction.create({
      type: TransactionType.ENTRY,
      value,
      userId: new UniqueEntityID(userId),
      accountId: transferAccount.id,
      description,
    })

    Promise.all([
      this.transactionsRepository.create(exitTransaction),
      this.transactionsRepository.create(entryTransaction),
    ])

    return success(null)
  }
}
