import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Account,
  AccountProps,
} from '@/domain/payment/enterprise/entities/account'

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
