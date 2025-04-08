import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Log } from '@/domain/payment/enterprise/entities/log'
import { Log as PrismaLog, Prisma } from '@prisma/client'

export class PrismaLogMapper {
  static toDomain(raw: PrismaLog): Log {
    return Log.create(
      {
        process: raw.process,
        value: raw.value,
        oldValue: raw.oldValue,
        timestamp: raw.timestamp,
        level: raw.level,
        userId: new UniqueEntityID(raw.userId),
        note: raw.note,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Log): Prisma.LogUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      process: raw.process,
      value: raw.value,
      oldValue: raw.oldValue,
      timestamp: raw.timestamp,
      level: raw.level,
      userId: raw.userId.toString(),
      note: raw.note,
    }
  }
}
