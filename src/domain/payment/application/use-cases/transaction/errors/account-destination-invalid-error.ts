import { UseCaseError } from '@/core/errors/use-case-error'

export class AccountDestinationInvalidError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The destination account is invalid.')
  }
}
