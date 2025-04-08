import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { DatabaseModule } from './database/database.module'

import { envSchema } from './env/env'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from './config/winston-config'
import { WinstonLoggerMiddleware } from './http/middlewares/winston-logger-middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    AuthModule,
    HttpModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WinstonLoggerMiddleware).forRoutes('*')
  }
}
