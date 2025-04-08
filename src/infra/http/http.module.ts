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

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    AuthenticateUserController,
    CreateUserController,
    GetAccountByUserIdController,
    GetAccountBalanceController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    GetAccountByUserIdUseCase,
    GetAccountBalanceUseCase,
  ],
})
export class HttpModule {}
