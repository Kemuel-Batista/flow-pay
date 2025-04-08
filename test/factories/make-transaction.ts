import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Transaction,
  TransactionProps,
} from '@/domain/payment/enterprise/entities/transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'

import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaTransactionMapper } from '@/infra/database/prisma/mappers/prisma-transaction-mapper'

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
) {
  const transaction = Transaction.create(
    {
      type: TransactionType.ENTRY,
      value: faker.number.int(),
      originAccountId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return transaction
}

@Injectable()
export class TransactionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTransaction(
    data: Partial<TransactionProps> = {},
  ): Promise<Transaction> {
    const transaction = makeTransaction(data)

    await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPersistency(transaction),
    })

    return transaction
  }
}
