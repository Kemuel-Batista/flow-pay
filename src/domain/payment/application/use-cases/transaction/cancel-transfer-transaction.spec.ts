import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { CancelTransferTransactionUseCase } from './cancel-transfer-transaction'
import { makeAccount } from 'test/factories/make-account'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from 'test/factories/make-transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CannotRevertTransactionError } from './errors/cannot-revert-transaction-error'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryLogsRepository: InMemoryLogsRepository

let sut: CancelTransferTransactionUseCase

describe('Cancel transfer transaction use case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository(
      inMemoryTransactionsRepository,
    )
    inMemoryLogsRepository = new InMemoryLogsRepository()

    sut = new CancelTransferTransactionUseCase(
      inMemoryTransactionsRepository,
      inMemoryAccountsRepository,
      inMemoryLogsRepository,
    )
  })

  it('should be able to cancel a transfer transaction if necessary', async () => {
    const originAccount = makeAccount({
      userId: new UniqueEntityID('1'),
    })

    const destinationAccount = makeAccount({
      userId: new UniqueEntityID('2'),
    })

    inMemoryAccountsRepository.items.push(originAccount, destinationAccount)

    const entryOriginTransaction = makeTransaction({
      type: TransactionType.ENTRY,
      value: 50,
      originAccountId: originAccount.id,
      userId: new UniqueEntityID('1'),
    })

    const transferTransaction = makeTransaction({
      type: TransactionType.TRANSFER,
      value: 50,
      originAccountId: originAccount.id,
      destinationAccountId: destinationAccount.id,
      userId: new UniqueEntityID('1'),
    })

    inMemoryTransactionsRepository.items.push(
      entryOriginTransaction,
      transferTransaction,
    )

    let originBalanceAccount = await inMemoryAccountsRepository.getBalance(
      originAccount.id.toString(),
    )
    expect(originBalanceAccount).equals(0)

    let destinationBalanceAccount = await inMemoryAccountsRepository.getBalance(
      destinationAccount.id.toString(),
    )
    expect(destinationBalanceAccount).equals(50)

    const result = await sut.execute({
      transactionId: transferTransaction.id.toString(),
      userId: '1',
    })

    expect(result.isSuccess()).toBe(true)

    originBalanceAccount = await inMemoryAccountsRepository.getBalance(
      originAccount.id.toString(),
    )
    expect(originBalanceAccount).equals(50)

    destinationBalanceAccount = await inMemoryAccountsRepository.getBalance(
      destinationAccount.id.toString(),
    )
    expect(destinationBalanceAccount).equals(0)

    expect(inMemoryTransactionsRepository.items).toHaveLength(3)
  })

  it('should not be able to cancel a transfer transaction if not exists', async () => {
    const result = await sut.execute({
      transactionId: '1',
      userId: '1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to cancel a transfer transaction not belogs to request user id', async () => {
    const transferTransaction = makeTransaction({
      type: TransactionType.TRANSFER,
      value: 50,
    })

    inMemoryTransactionsRepository.items.push(transferTransaction)

    const result = await sut.execute({
      transactionId: transferTransaction.id.toString(),
      userId: '1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to cancel a transaction if not is a transfer transaction', async () => {
    const transferTransaction = makeTransaction({
      type: TransactionType.ENTRY,
      value: 50,
      userId: new UniqueEntityID('1'),
    })

    inMemoryTransactionsRepository.items.push(transferTransaction)

    const result = await sut.execute({
      transactionId: transferTransaction.id.toString(),
      userId: '1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(CannotRevertTransactionError)
  })
})
