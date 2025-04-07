import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { TransactionStatus } from '../enums/transaction-status'

export interface TransactionProps {
  value: number
  description?: string
  type: number
  status: number
  accountId: UniqueEntityID
  userId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Transaction extends Entity<TransactionProps> {
  get value() {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | undefined) {
    this.props.description = description
    this.touch()
  }

  get accountId() {
    return this.props.accountId
  }

  set accountId(accountId: UniqueEntityID) {
    this.props.accountId = accountId
    this.touch()
  }

  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId
    this.touch()
  }

  get type() {
    return this.props.type
  }

  set type(type: number) {
    this.props.type = type
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: number) {
    this.props.status = status
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<TransactionProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        status: props.status ?? TransactionStatus.NEW,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return transaction
  }
}
