import { AccountsRepository } from '@/domain/payment/application/repositories/accounts-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Account } from '@/domain/payment/enterprise/entities/account'
import { PrismaAccountMapper } from '../mappers/prisma-account-mapper'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'

@Injectable()
export class PrismaAccountRepository implements AccountsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        id,
      },
    })

    if (!account) {
      return null
    }

    return PrismaAccountMapper.toDomain(account)
  }

  async findByUserId(userId: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        userId,
      },
    })

    if (!account) {
      return null
    }

    return PrismaAccountMapper.toDomain(account)
  }

  async findByAccountInformation(
    bankNumber: string,
    agencyNumber: string,
    accountNumber: string,
  ): Promise<Account | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        bankNumber,
        agencyNumber,
        accountNumber,
      },
    })

    if (!account) {
      return null
    }

    return PrismaAccountMapper.toDomain(account)
  }

  async getBalance(accountId: string): Promise<number> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          {
            originAccountId: accountId,
          },
          {
            destinationAccountId: accountId,
          },
        ],
      },
    })

    let totalEntry = 0
    let totalExit = 0

    for (const t of transactions) {
      const isEntry =
        (t.type === TransactionType.ENTRY &&
          t.originAccountId.toString() === accountId) ||
        (t.type === TransactionType.TRANSFER &&
          t.destinationAccountId?.toString() === accountId)

      const isExit =
        (t.type === TransactionType.EXIT &&
          t.originAccountId.toString() === accountId) ||
        (t.type === TransactionType.TRANSFER &&
          t.originAccountId.toString() === accountId)

      if (isEntry) totalEntry += t.value
      if (isExit) totalExit += t.value
    }

    return totalEntry - totalExit
  }

  async getLastAccountNumber(): Promise<string> {
    const lastAccount = await this.prisma.account.findFirst({
      orderBy: {
        accountNumber: 'desc',
      },
      select: {
        accountNumber: true,
      },
    })

    return lastAccount?.accountNumber ?? '000000'
  }

  async save(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPersistency(account)

    await this.prisma.account.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPersistency(account)

    await this.prisma.account.create({
      data,
    })
  }
}
