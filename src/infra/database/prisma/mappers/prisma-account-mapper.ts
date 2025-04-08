import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Account } from '@/domain/payment/enterprise/entities/account'
import { Account as PrismaAccount, Prisma } from '@prisma/client'

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create(
      {
        userId: new UniqueEntityID(raw.userId),
        bankNumber: raw.bankNumber,
        agencyNumber: raw.agencyNumber,
        accountNumber: raw.accountNumber,
        status: raw.status,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy
          ? new UniqueEntityID(raw.updatedBy)
          : undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Account): Prisma.AccountUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      userId: raw.userId.toString(),
      bankNumber: raw.bankNumber,
      agencyNumber: raw.agencyNumber,
      accountNumber: raw.accountNumber,
      status: raw.status,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy?.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy?.toString(),
    }
  }
}
