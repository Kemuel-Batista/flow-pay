import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { CancelTransferTransactionUseCase } from '@/domain/payment/application/use-cases/transaction/cancel-transfer-transaction'
import { AccountDestinationInvalidError } from '@/domain/payment/application/use-cases/transaction/errors/account-destination-invalid-error'
import { CannotRevertTransactionError } from '@/domain/payment/application/use-cases/transaction/errors/cannot-revert-transaction-error'
import { logger } from '@/infra/config/winston-config'

@Controller('/transaction/transfer/cancel/:transactionId')
export class CancelTransferTransactionController {
  constructor(
    private cancelTransferTransaction: CancelTransferTransactionUseCase,
  ) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param('transactionId') transactionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.cancelTransferTransaction.execute({
      transactionId,
      userId,
    })

    if (result.isError()) {
      const error = result.value
      logger.error(`Cancel Transfer Transaction Error - ${error.message}`)

      switch (error.constructor) {
        case CannotRevertTransactionError:
          throw new NotAcceptableException(error.message)
        case AccountDestinationInvalidError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
