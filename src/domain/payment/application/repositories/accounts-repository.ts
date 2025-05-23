import { Account } from '../../enterprise/entities/account'

export abstract class AccountsRepository {
  abstract findById(id: string): Promise<Account | null>
  abstract findByUserId(userId: string): Promise<Account | null>
  abstract findByAccountInformation(
    bankNumber: string,
    agencyNumber: string,
    accountNumber: string,
  ): Promise<Account | null>

  abstract getBalance(id: string): Promise<number>
  abstract getLastAccountNumber(): Promise<string>
  abstract save(account: Account): Promise<void>
  abstract create(account: Account): Promise<void>
}
