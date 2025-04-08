import { UseCaseError } from '@/core/errors/use-case-error'

export class CannotRevertTransactionError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('You cannot revert this operation.')
  }
}
