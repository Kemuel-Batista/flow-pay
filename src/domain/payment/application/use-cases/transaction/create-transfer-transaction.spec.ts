import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { CreateTransferTransactionUseCase } from './create-transfer-transaction'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAccount } from 'test/factories/make-account'

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
  })
})
