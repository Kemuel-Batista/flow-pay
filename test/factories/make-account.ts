import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Account,
  AccountProps,
} from '@/domain/payment/enterprise/entities/account'

import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAccountMapper } from '@/infra/database/prisma/mappers/prisma-account-mapper'

export function makeAccount(
  override: Partial<AccountProps> = {},
  id?: UniqueEntityID,
) {
  const account = Account.create(
    {
      bankNumber: String(faker.number.int({ max: 3 })),
      agencyNumber: String(faker.number.int({ max: 3 })),
      accountNumber: String(faker.number.int({ max: 3 })),
      userId: new UniqueEntityID(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return account
}

@Injectable()
export class AccountFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAccount(data: Partial<AccountProps> = {}): Promise<Account> {
    const account = makeAccount(data)

    await this.prisma.account.create({
      data: PrismaAccountMapper.toPersistency(account),
    })

    return account
  }
}
