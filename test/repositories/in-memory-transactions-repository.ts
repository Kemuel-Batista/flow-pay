import { TransactionsRepository } from '@/domain/payment/application/repositories/transactions-repository'
import { Transaction } from '@/domain/payment/enterprise/entities/transaction'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.items.find((item) => item.id.toString() === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async findManyByUserId(userId: string): Promise<Transaction[]> {
    const transactions = this.items.filter(
      (item) => item.userId.toString() === userId,
    )

    return transactions
  }

  async save(transaction: Transaction): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === transaction.id)

    this.items[itemIndex] = transaction
  }

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }
}
