import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { GetAccountBalanceUseCase } from '@/domain/payment/application/use-cases/account/get-account-balance'

@Controller('/account/me/balance/:id')
export class GetAccountBalanceController {
  constructor(private getAccountBalance: GetAccountBalanceUseCase) {}

  @Get()
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const result = await this.getAccountBalance.execute({
      id,
      userId: user.sub,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { amount } = result.value

    return {
      amount,
    }
  }
}
