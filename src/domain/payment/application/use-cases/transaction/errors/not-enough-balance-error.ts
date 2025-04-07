import { UseCaseError } from '@/core/errors/use-case-error'

export class NotEnoughBalanceError extends Error implements UseCaseError {
  constructor() {
    super('Not enough balance for this operation.')
  }
}
