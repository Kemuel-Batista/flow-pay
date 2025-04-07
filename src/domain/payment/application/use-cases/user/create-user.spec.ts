import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { ResourceAlreadyExistsError } from '@/core/errors/errors/resource-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let sut: CreateUserUseCase

describe('Create user use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      name: 'Kemuel',
      lastname: 'Batista',
      username: 'kemuel-batista',
      password: '123456',
      email: 'kemuellima20@gmail.com',
      phoneNumber: '41984545987',
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
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
