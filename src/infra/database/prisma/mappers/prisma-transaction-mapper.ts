import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'
import { Transaction as PrismaTransaction, Prisma } from '@prisma/client'

export class PrismaTransactionMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create(
      {
        value: raw.value,
        description: raw.description ?? undefined,
        type: raw.type,
        status: raw.status,
        originAccountId: new UniqueEntityID(raw.originAccountId),
        destinationAccountId: raw.destinationAccountId
          ? new UniqueEntityID(raw.destinationAccountId)
          : undefined,
        userId: new UniqueEntityID(raw.userId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(
    raw: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      value: raw.value,
      description: raw.description ?? undefined,
      type: raw.type,
      status: raw.status,
      originAccountId: raw.originAccountId.toString(),
      destinationAccountId: raw.destinationAccountId?.toString(),
      userId: raw.userId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
