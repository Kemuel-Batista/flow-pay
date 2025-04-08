import { Transaction } from '@/domain/payment/enterprise/entities/transaction'

export class TransactionPresenter {
  static toHTTP(raw: Transaction) {
    return {
      id: raw.id.toString(),
      value: raw.value,
      description: raw.description,
      type: raw.type,
      status: raw.status,
      originAccountId: raw.originAccountId.toString(),
      destinationAccountId: raw.destinationAccountId?.toString(),
      userId: raw.userId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
