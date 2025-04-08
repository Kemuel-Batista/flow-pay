import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { ResourceAlreadyExistsError } from '@/core/errors/errors/resource-already-exists-error'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { makeAccount } from 'test/factories/make-account'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryAccountsRepository: InMemoryAccountsRepository
let fakeHasher: FakeHasher

let sut: CreateUserUseCase

describe('Create user use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository(
      inMemoryTransactionsRepository,
    )

    sut = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      inMemoryAccountsRepository,
    )
  })

  it('should be able to create a new user and account', async () => {
    const result = await sut.execute({
      name: 'Kemuel',
      lastname: 'Batista',
      username: 'kemuel-batista',
      password: '123456',
      email: 'kemuellima20@gmail.com',
      phoneNumber: '41984545987',
      createdBy: '1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Kemuel',
          lastname: 'Batista',
          username: 'kemuel-batista',
          password: '123456-hashed',
          email: 'kemuellima20@gmail.com',
          phoneNumber: '41984545987',
        }),
      ]),
    )

    expect(inMemoryAccountsRepository.items).toHaveLength(1)
    expect(inMemoryAccountsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accountNumber: '000001',
        }),
      ]),
    )
  })

  it('should not be able to create a new user if username already exists', async () => {
    const user = makeUser({
      username: 'kemuel-batista',
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      name: 'Kemuel',
      lastname: 'Batista',
      username: 'kemuel-batista',
      password: '123456',
      email: 'kemuellima20@gmail.com',
      phoneNumber: '41984545987',
      createdBy: '1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should be able to respect the last accountNumber and create another account with another number', async () => {
    const account = makeAccount({
      accountNumber: '000001',
    })

    inMemoryAccountsRepository.items.push(account)

    const result = await sut.execute({
      name: 'Kemuel',
      lastname: 'Batista',
      username: 'kemuel-batista',
      password: '123456',
      email: 'kemuellima20@gmail.com',
      phoneNumber: '41984545987',
      createdBy: '1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Kemuel',
          lastname: 'Batista',
          username: 'kemuel-batista',
          password: '123456-hashed',
          email: 'kemuellima20@gmail.com',
          phoneNumber: '41984545987',
        }),
      ]),
    )

    expect(inMemoryAccountsRepository.items).toHaveLength(2)
    expect(inMemoryAccountsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accountNumber: '000002',
        }),
      ]),
    )
  })
})
