import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  PreconditionFailedException,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { CreateDefaultTransactionUseCase } from '@/domain/payment/application/use-cases/transaction/create-default-transaction'
import { NotEnoughBalanceError } from '@/domain/payment/application/use-cases/transaction/errors/not-enough-balance-error'

const createDefaultTransactionBodySchema = z.object({
  value: z.number().int(),
  type: z.enum(['0', '1', '2']),
})

const bodyValidationPipe = new ZodValidationPipe(
  createDefaultTransactionBodySchema,
)
type CreateDefaultTransactionBodySchema = z.infer<
  typeof createDefaultTransactionBodySchema
>

@Controller('/transaction')
export class CreateDefaultTransactionController {
  constructor(
    private createDefaultTransaction: CreateDefaultTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateDefaultTransactionBodySchema,
  ) {
    const userId = user.sub
    const { value, type } = body

    const result = await this.createDefaultTransaction.execute({
      value,
      type: Number(type),
      userId,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case NotEnoughBalanceError:
          throw new PreconditionFailedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
