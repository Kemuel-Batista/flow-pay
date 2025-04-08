import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { EnvModule } from '../env/env.module'

import { AuthenticateUserController } from './controllers/user/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/payment/application/use-cases/user/authenticate-student'
import { CreateUserController } from './controllers/user/create-user.controller'
import { CreateUserUseCase } from '@/domain/payment/application/use-cases/user/create-user'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [AuthenticateUserController, CreateUserController],
  providers: [AuthenticateUserUseCase, CreateUserUseCase],
})
export class HttpModule {}
