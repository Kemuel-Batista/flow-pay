import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { CreateTransferTransactionUseCase } from './create-transfer-transaction'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAccount } from 'test/factories/make-account'
import { makeTransaction } from 'test/factories/make-transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: CreateTransferTransactionUseCase

describe('Create transfer transaction use case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository(
      inMemoryTransactionsRepository,
    )

    sut = new CreateTransferTransactionUseCase(
      inMemoryAccountsRepository,
      inMemoryTransactionsRepository,
    )
  })

  it('should be able to create a transfer transaction for another account', async () => {
    const account = makeAccount({
      userId: new UniqueEntityID('1'),
    })

    const transferAccount = makeAccount({
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: '0943279847',
    })

    inMemoryAccountsRepository.items.push(account, transferAccount)

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        accountId: account.id,
        type: TransactionType.ENTRY,
        userId: account.userId,
        value: 50,
      }),
    )

    const result = await sut.execute({
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: '0943279847',
      value: 50,
      userId: '1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryTransactionsRepository.items).toHaveLength(3)

    const balanceOfAccount = await inMemoryAccountsRepository.getBalance(
      account.id.toString(),
    )
    expect(balanceOfAccount).toEqual(0)

    const balanceOfTransferAccount =
      await inMemoryAccountsRepository.getBalance(account.id.toString())
    expect(balanceOfTransferAccount).toEqual(0)
  })
})
