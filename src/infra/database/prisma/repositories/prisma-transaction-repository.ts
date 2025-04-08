import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TransactionsRepository } from '@/domain/payment/application/repositories/transactions-repository'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'
import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'

@Injectable()
export class PrismaTransactionRepository implements TransactionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) {
      return null
    }

    return PrismaTransactionMapper.toDomain(transaction)
  }

  async findManyByUserId(userId: string): Promise<Transaction[]> {
    const [transactions] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where: {
          userId,
        },
      }),
    ])

    return transactions.map(PrismaTransactionMapper.toDomain)
  }

  async save(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionMapper.toPersistency(transaction)

    await this.prisma.transaction.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionMapper.toPersistency(transaction)

    await this.prisma.transaction.create({
      data,
    })
  }
}
