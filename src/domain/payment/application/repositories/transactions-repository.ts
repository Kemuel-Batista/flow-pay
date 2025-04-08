import { Transaction } from '../../enterprise/entities/transaction'

export abstract class TransactionsRepository {
  abstract findById(id: string): Promise<Transaction | null>
  abstract save(transaction: Transaction): Promise<void>
  abstract create(transaction: Transaction): Promise<void>
  abstract listByUserId(userId: string): Promise<Transaction[]>
}
