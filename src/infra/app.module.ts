import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { DatabaseModule } from './database/database.module'

import { envSchema } from './env/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
