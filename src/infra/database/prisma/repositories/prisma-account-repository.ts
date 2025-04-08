import { AccountsRepository } from '@/domain/payment/application/repositories/accounts-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Account } from '@/domain/payment/enterprise/entities/account'
import { PrismaAccountMapper } from '../mappers/prisma-account-mapper'

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
    const [entries, exits] = await Promise.all([
      this.prisma.transaction.aggregate({
        _sum: { value: true },
        where: {
          destinationAccountId: accountId,
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { value: true },
        where: {
          originAccountId: accountId,
        },
      }),
    ])

    const entrySum = entries._sum.value ?? 0
    const exitSum = exits._sum.value ?? 0

    return entrySum - exitSum
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
