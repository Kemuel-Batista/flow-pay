import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

import { UsersRepository } from '@/domain/payment/application/repositories/users-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

import { AccountsRepository } from '@/domain/payment/application/repositories/accounts-repository'
import { PrismaAccountRepository } from './prisma/repositories/prisma-account-repository'

import { TransactionsRepository } from '@/domain/payment/application/repositories/transactions-repository'
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository'

import { LogsRepository } from '@/domain/payment/application/repositories/logs-repository'
import { PrismaLogRepository } from './prisma/repositories/prisma-log-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: AccountsRepository,
      useClass: PrismaAccountRepository,
    },
    {
      provide: TransactionsRepository,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: LogsRepository,
      useClass: PrismaLogRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    AccountsRepository,
    TransactionsRepository,
    LogsRepository,
  ],
})
export class DatabaseModule {}
