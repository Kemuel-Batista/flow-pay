import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Transaction,
  TransactionProps,
} from '@/domain/payment/enterprise/entities/transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
) {
  const transaction = Transaction.create(
    {
      type: TransactionType.ENTRY,
      value: faker.number.int(),
      accountId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return transaction
}
