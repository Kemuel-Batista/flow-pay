import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { LogsRepository } from '@/domain/payment/application/repositories/logs-repository'
import { Log } from '@/domain/payment/enterprise/entities/log'
import { PrismaLogMapper } from '../mappers/prisma-log-mapper'

@Injectable()
export class PrismaLogRepository implements LogsRepository {
  constructor(private prisma: PrismaService) {}

  async create(log: Log): Promise<void> {
    const data = PrismaLogMapper.toPersistency(log)

    await this.prisma.log.create({
      data,
    })
  }
}
