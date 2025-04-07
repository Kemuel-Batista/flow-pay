import { UseCaseError } from '@/core/errors/use-case-error'

export class WalletDestinationInvalidError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The destination wallet name is invalid.')
  }
}
