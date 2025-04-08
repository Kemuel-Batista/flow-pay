import { Account } from '@/domain/payment/enterprise/entities/account'

export class AccountPresenter {
  static toHTTP(raw: Account) {
    return {
      id: raw.id.toString(),
      bankNumber: raw.bankNumber,
      agencyNumber: raw.agencyNumber,
      accountNumber: raw.accountNumber,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
