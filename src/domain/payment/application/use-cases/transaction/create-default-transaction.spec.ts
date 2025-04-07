import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { CreateDefaultTransactionUseCase } from './create-default-transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { makeAccount } from 'test/factories/make-account'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: CreateDefaultTransactionUseCase

describe('Create default transaction use case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository(
      inMemoryTransactionsRepository,
    )

    sut = new CreateDefaultTransactionUseCase(
      inMemoryAccountsRepository,
      inMemoryTransactionsRepository,
    )
  })

  it('should be able to create a new entry transaction', async () => {
    const account = makeAccount({
      userId: new UniqueEntityID('1'),
    })

    inMemoryAccountsRepository.items.push(account)

    const result = await sut.execute({
      type: TransactionType.ENTRY,
      userId: '1',
      value: 100,
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryTransactionsRepository.items).toHaveLength(1)
    expect(inMemoryTransactionsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: TransactionType.ENTRY,
          userId: new UniqueEntityID('1'),
          value: 100,
        }),
      ]),
    )
  })
})
