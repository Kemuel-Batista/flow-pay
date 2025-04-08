import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/payment/enterprise/entities/user'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        lastname: raw.lastname,
        username: raw.username,
        password: raw.password,
        email: raw.email,
        phoneNumber: raw.phoneNumber,
        createdAt: raw.createdAt,
        createdBy: raw.createdBy
          ? new UniqueEntityID(raw.createdBy)
          : undefined,
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy
          ? new UniqueEntityID(raw.updatedBy)
          : undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: User): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      lastname: raw.lastname,
      username: raw.username,
      password: raw.password,
      email: raw.email,
      phoneNumber: raw.phoneNumber,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy?.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy?.toString(),
    }
  }
}
