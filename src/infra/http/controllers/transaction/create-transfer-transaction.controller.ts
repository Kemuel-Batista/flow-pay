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

import { CreateTransferTransactionUseCase } from '@/domain/payment/application/use-cases/transaction/create-transfer-transaction'
import { NotEnoughBalanceError } from '@/domain/payment/application/use-cases/transaction/errors/not-enough-balance-error'

const createTransferTransactionBodySchema = z.object({
  bankNumber: z.string(),
  agencyNumber: z.string(),
  accountNumber: z.string(),
  value: z.number().int(),
  description: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(
  createTransferTransactionBodySchema,
)
type CreateTransferTransactionBodySchema = z.infer<
  typeof createTransferTransactionBodySchema
>

@Controller('/transaction/transfer')
export class CreateTransferTransactionController {
  constructor(
    private createTransferTransaction: CreateTransferTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateTransferTransactionBodySchema,
  ) {
    const userId = user.sub
    const { bankNumber, agencyNumber, accountNumber, value, description } = body

    const result = await this.createTransferTransaction.execute({
      bankNumber,
      agencyNumber,
      accountNumber,
      value,
      description,
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
