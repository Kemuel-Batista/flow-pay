import { Either, failure, success } from '@/core/either'
import { HashGenerator } from '../../cryptography/hash-generator'
import { UsersRepository } from '../../repositories/users-repository'
import { ResourceAlreadyExistsError } from '@/core/errors/errors/resource-already-exists-error'
import { User } from '@/domain/payment/enterprise/entities/user'
import { AccountsRepository } from '../../repositories/accounts-repository'
import { Account } from '@/domain/payment/enterprise/entities/account'
import { AccountStatus } from '@/domain/payment/enterprise/enums/account-status'

interface CreateUserUseCaseRequest {
  name: string
  lastname: string
  username: string
  password: string
  email: string
  phoneNumber: string
}

type CreateUserUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private accountsRepository: AccountsRepository,
  ) {}

  async execute({
    name,
    lastname,
    username,
    password,
    email,
    phoneNumber,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameUsername =
      await this.usersRepository.findByUsername(username)

    if (userWithSameUsername) {
      return failure(
        new ResourceAlreadyExistsError(
          'User with this username already exisys',
        ),
      )
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      lastname,
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    })

    await this.usersRepository.create(user)

    const lastAccountNumber =
      await this.accountsRepository.getLastAccountNumber()
    const nextAccountNumber = String(Number(lastAccountNumber) + 1).padStart(
      6,
      '0',
    )
    const account = Account.create({
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: nextAccountNumber,
      status: AccountStatus.ACTIVE,
      userId: user.id,
      createdBy: user.id,
    })

    await this.accountsRepository.create(account)

    return success({
      user,
    })
  }
}
