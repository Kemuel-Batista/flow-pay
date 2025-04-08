import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { TransactionsRepository } from '../../repositories/transactions-repository'
import { LogsRepository } from '../../repositories/logs-repository'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { CannotRevertTransactionError } from './errors/cannot-revert-transaction-error'
import { AccountsRepository } from '../../repositories/accounts-repository'
import { AccountDestinationInvalidError } from './errors/account-destination-invalid-error'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { TransactionStatus } from '@/domain/payment/enterprise/enums/transaction-status'
import { Log } from '@/domain/payment/enterprise/entities/log'
import { LogLevel } from '@/domain/payment/enterprise/enums/log-level'

interface CancelTransferTransactionUseCaseRequest {
  transactionId: string
  userId: string
}

type CancelTransferTransactionUseCaseResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | CannotRevertTransactionError
  | AccountDestinationInvalidError,
  null
>

export class CancelTransferTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private accountsRepository: AccountsRepository,
    private logsRepository: LogsRepository,
  ) {}

  async execute({
    transactionId,
    userId,
  }: CancelTransferTransactionUseCaseRequest): Promise<CancelTransferTransactionUseCaseResponse> {
    const transaction =
      await this.transactionsRepository.findById(transactionId)

    if (!transaction) {
      return failure(new ResourceNotFoundError())
    }

    if (transaction.userId.toString() !== userId) {
      return failure(new NotAllowedError())
    }

    if (transaction.type !== TransactionType.TRANSFER) {
      return failure(new CannotRevertTransactionError())
    }

    const originAccount = await this.accountsRepository.findById(
      transaction.originAccountId.toString(),
    )

    if (!originAccount) {
      return failure(new ResourceNotFoundError())
    }

    const destinationAccount = await this.accountsRepository.findById(
      transaction.destinationAccountId!.toString(),
    )

    if (!destinationAccount) {
      return failure(new AccountDestinationInvalidError())
    }

    const transferTransaction = Transaction.create({
      type: TransactionType.TRANSFER,
      value: transaction.value,
      userId: new UniqueEntityID(userId),
      originAccountId: destinationAccount.id,
      destinationAccountId: originAccount.id,
      description: 'Reverted transfer',
    })

    await this.transactionsRepository.create(transferTransaction)

    // Save old transaction with canceled status
    transaction.status = TransactionStatus.CANCELED
    await this.transactionsRepository.save(transaction)

    const log = Log.create({
      process: 'transaction.transfer-revert',
      level: LogLevel.TRACE,
      userId: new UniqueEntityID(userId),
      value: `entry-transaction.value: ${transferTransaction.value} | entry-account: ${originAccount.id}`,
      oldValue: `transfer-transaction.value: ${transferTransaction.value} | transfer-account: ${destinationAccount.id}`,
    })

    const logStatus = Log.create({
      process: 'transaction.change-status',
      level: LogLevel.TRACE,
      userId: new UniqueEntityID(userId),
      value: `transaction.status: ${transaction.status}`,
      oldValue: `transaction.status: ${TransactionStatus.SUCCEEDED}`,
    })

    await Promise.all([
      this.logsRepository.create(log),
      this.logsRepository.create(logStatus),
    ])

    return success(null)
  }
}
