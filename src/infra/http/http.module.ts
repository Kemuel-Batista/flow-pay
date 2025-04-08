import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { EnvModule } from '../env/env.module'

import { AuthenticateUserController } from './controllers/user/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/payment/application/use-cases/user/authenticate-student'
import { CreateUserController } from './controllers/user/create-user.controller'
import { CreateUserUseCase } from '@/domain/payment/application/use-cases/user/create-user'

import { GetAccountByUserIdController } from './controllers/account/get-account-by-user-id.controller'
import { GetAccountByUserIdUseCase } from '@/domain/payment/application/use-cases/account/get-account-by-user-id'
import { GetAccountBalanceController } from './controllers/account/get-account-balance.controller'
import { GetAccountBalanceUseCase } from '@/domain/payment/application/use-cases/account/get-account-balance'

import { CreateTransferTransactionController } from './controllers/transaction/create-transfer-transaction.controller'
import { CreateTransferTransactionUseCase } from '@/domain/payment/application/use-cases/transaction/create-transfer-transaction'
import { CreateDefaultTransactionController } from './controllers/transaction/create-default-transaction.controller'
import { CreateDefaultTransactionUseCase } from '@/domain/payment/application/use-cases/transaction/create-default-transaction'
import { CancelTransferTransactionController } from './controllers/transaction/cancel-transfer-transaction.controller'
import { CancelTransferTransactionUseCase } from '@/domain/payment/application/use-cases/transaction/cancel-transfer-transaction'
import { FetchTransactionsByAccountIdController } from './controllers/transaction/fetch-transactions-by-account-id.controller'
import { FetchTransactionsByAccountIdUseCase } from '@/domain/payment/application/use-cases/transaction/fetch-transactions-by-account-id'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    AuthenticateUserController,
    CreateUserController,
    GetAccountByUserIdController,
    GetAccountBalanceController,
    CreateDefaultTransactionController,
    CreateTransferTransactionController,
    CancelTransferTransactionController,
    FetchTransactionsByAccountIdController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    GetAccountByUserIdUseCase,
    GetAccountBalanceUseCase,
    CreateDefaultTransactionUseCase,
    CreateTransferTransactionUseCase,
    CancelTransferTransactionUseCase,
    FetchTransactionsByAccountIdUseCase,
  ],
})
export class HttpModule {}
