import { BadRequestException, Controller, Get } from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { GetAccountByUserIdUseCase } from '@/domain/payment/application/use-cases/account/get-account-by-user-id'
import { AccountPresenter } from '../../presenters/account-presenter'

@Controller('/account/me')
export class GetAccountByUserIdController {
  constructor(private getAccountByUserId: GetAccountByUserIdUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getAccountByUserId.execute({
      userId: user.sub,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    return {
      account: AccountPresenter.toHTTP(result.value.account),
    }
  }
}
