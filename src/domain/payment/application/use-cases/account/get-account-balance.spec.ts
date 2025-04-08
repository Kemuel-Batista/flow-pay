import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { GetAccountBalanceUseCase } from './get-account-balance'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from 'test/factories/make-transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { makeAccount } from 'test/factories/make-account'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: GetAccountBalanceUseCase

describe('Get account balance use case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository(
      inMemoryTransactionsRepository,
    )

    sut = new GetAccountBalanceUseCase(inMemoryAccountsRepository)
  })

  it('should be able to return zero when no transactions exists', async () => {
    await inMemoryAccountsRepository.create(
      makeAccount(
        {
          userId: new UniqueEntityID('1'),
        },
        new UniqueEntityID('1'),
      ),
    )

    const result = await sut.execute({
      id: '1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      amount: 0,
    })
  })

  it('should be able to return zero when no transactions exists', async () => {
    const account = makeAccount(
      {
        userId: new UniqueEntityID('1'),
      },
      new UniqueEntityID('1'),
    )
    inMemoryAccountsRepository.items.push(account)

    await inMemoryTransactionsRepository.create(
      makeTransaction({
        type: TransactionType.ENTRY,
        value: 200,
        originAccountId: account.id,
        userId: new UniqueEntityID('1'),
      }),
    )

    await inMemoryTransactionsRepository.create(
      makeTransaction({
        type: TransactionType.EXIT,
        value: 100,
        originAccountId: account.id,
        userId: new UniqueEntityID('1'),
      }),
    )

    const result = await sut.execute({
      id: '1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      amount: 100,
    })
  })
})
