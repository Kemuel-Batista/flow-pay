import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AccountsRepository } from '../../repositories/accounts-repository'
import { TransactionsRepository } from '../../repositories/transactions-repository'
import { NotEnoughBalanceError } from './errors/not-enough-balance-error'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Log } from '@/domain/payment/enterprise/entities/log'
import { LogLevel } from '@/domain/payment/enterprise/enums/log-level'
import { LogsRepository } from '../../repositories/logs-repository'

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
    private logsRepository: LogsRepository,
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

    const balance = await this.accountsRepository.getBalance(
      account.id.toString(),
    )

    if (balance < value) {
      return failure(new NotEnoughBalanceError())
    }

    const transferTransaction = Transaction.create({
      type: TransactionType.TRANSFER,
      value,
      userId: new UniqueEntityID(userId),
      originAccountId: account.id,
      destinationAccountId: transferAccount.id,
      description,
    })

    await this.transactionsRepository.create(transferTransaction)

    const log = Log.create({
      process: 'transaction.transfer',
      level: LogLevel.TRACE,
      userId: new UniqueEntityID(userId),
      value: `entry-transaction.value: ${transferTransaction.value} | entry-account: ${transferAccount.id}`,
      oldValue: `transfer-transaction.value: ${transferTransaction.value} | transfer-account: ${account.id}`,
      note: `account.bankNumber: ${bankNumber} | account.agencyNumber: ${agencyNumber} | account.accountNumber: ${accountNumber}`,
    })

    await this.logsRepository.create(log)

    return success(null)
  }
}
