import { Account } from '@/domain/payment/enterprise/entities/account'
import { InMemoryTransactionsRepository } from './in-memory-transactions-repository'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { AccountsRepository } from '@/domain/payment/application/repositories/accounts-repository'

export class InMemoryAccountsRepository implements AccountsRepository {
  public items: Account[] = []

  constructor(private transactionsRepository: InMemoryTransactionsRepository) {}

  async findById(id: string): Promise<Account | null> {
    const account = this.items.find((item) => item.id.toString() === id)

    if (!account) {
      return null
    }

    return account
  }

  async findByUserId(userId: string): Promise<Account | null> {
    const account = this.items.find((item) => item.userId.toString() === userId)

    if (!account) {
      return null
    }

    return account
  }

  async findByAccountInformation(
    bankNumber: string,
    agencyNumber: string,
    accountNumber: string,
  ): Promise<Account | null> {
    const account = this.items.find(
      (item) =>
        item.bankNumber === bankNumber &&
        item.agencyNumber === agencyNumber &&
        item.accountNumber === accountNumber,
    )

    if (!account) {
      return null
    }

    return account
  }

  async getBalance(id: string): Promise<number> {
    const transactions = this.transactionsRepository.items.filter(
      (transaction) => {
        return (
          transaction.originAccountId.toString() === id ||
          transaction.destinationAccountId?.toString() === id
        )
      },
    )

    let totalEntry = 0
    let totalExit = 0

    for (const t of transactions) {
      const isEntry =
        (t.type === TransactionType.ENTRY &&
          t.originAccountId.toString() === id) ||
        (t.type === TransactionType.TRANSFER &&
          t.destinationAccountId?.toString() === id)

      const isExit =
        (t.type === TransactionType.EXIT &&
          t.originAccountId.toString() === id) ||
        (t.type === TransactionType.TRANSFER &&
          t.originAccountId.toString() === id)

      if (isEntry) totalEntry += t.value
      if (isExit) totalExit += t.value
    }

    return totalEntry - totalExit
  }

  async listByUserId(userId: string): Promise<Account[]> {
    const accounts = this.items.filter(
      (item) => item.userId.toString() === userId,
    )

    return accounts
  }

  async save(account: Account): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === account.id)

    this.items[itemIndex] = account
  }

  async create(account: Account): Promise<void> {
    this.items.push(account)
  }
}
