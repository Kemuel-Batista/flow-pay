import {
  BadRequestException,
  Controller,
  Get,
  Param,
  PreconditionFailedException,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { FetchTransactionsByAccountIdUseCase } from '@/domain/payment/application/use-cases/transaction/fetch-transactions-by-account-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { TransactionPresenter } from '../../presenters/transaction-presenter'

@Controller('/transaction/:accountId')
export class FetchTransactionsByAccountIdController {
  constructor(
    private fetchTransactionsByAccountId: FetchTransactionsByAccountIdUseCase,
  ) {}

  @Get()
  async handle(
    @Param('accountId') accountId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchTransactionsByAccountId.execute({
      accountId,
      userId: user.sub,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new PreconditionFailedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { transactions } = result.value

    return {
      transactions: transactions.map(TransactionPresenter.toHTTP),
    }
  }
}
