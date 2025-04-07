import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { GetAccountByUserIdUseCase } from './get-account-by-user-id'
import { makeAccount } from 'test/factories/make-account'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: GetAccountByUserIdUseCase

describe('Get account by user id use case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository(
      inMemoryTransactionsRepository,
    )

    sut = new GetAccountByUserIdUseCase(inMemoryAccountsRepository)
  })

  it('should be able to get account from user id', async () => {
    const account = makeAccount({
      userId: new UniqueEntityID('1'),
    })

    inMemoryAccountsRepository.items.push(account)

    const result = await sut.execute({
      userId: '1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      account,
    })
  })
})
