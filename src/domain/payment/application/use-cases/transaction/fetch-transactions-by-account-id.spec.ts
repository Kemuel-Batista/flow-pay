import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { FetchTransactionsByAccountIdUseCase } from './fetch-transactions-by-account-id'
import { makeAccount } from 'test/factories/make-account'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from 'test/factories/make-transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: FetchTransactionsByAccountIdUseCase

describe('Fetch transactions by account id use case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository(
      inMemoryTransactionsRepository,
    )

    sut = new FetchTransactionsByAccountIdUseCase(
      inMemoryAccountsRepository,
      inMemoryTransactionsRepository,
    )
  })

  it('should be able to fecth transactions by account id', async () => {
    const account = makeAccount({
      userId: new UniqueEntityID('1'),
    })

    inMemoryAccountsRepository.items.push(account)

    const transaction = makeTransaction({
      originAccountId: account.id,
      value: 50,
      type: TransactionType.ENTRY,
      userId: new UniqueEntityID('1'),
    })

    inMemoryTransactionsRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: account.id.toString(),
      userId: '1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      transactions: expect.arrayContaining([
        expect.objectContaining({
          originAccountId: account.id,
          value: 50,
          type: TransactionType.ENTRY,
          userId: new UniqueEntityID('1'),
        }),
      ]),
    })
  })
})
