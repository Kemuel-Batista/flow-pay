import { Transaction } from '../../enterprise/entities/transaction'

export abstract class TransactionsRepository {
  abstract save(transaction: Transaction): Promise<void>
  abstract create(transaction: Transaction): Promise<void>
  abstract listByUserId(userId: string): Promise<Transaction[]>
}
