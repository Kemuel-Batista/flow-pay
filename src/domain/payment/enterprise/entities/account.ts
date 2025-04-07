import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AccountStatus } from '../enums/account-status'

export interface AccountProps {
  userId: UniqueEntityID
  bankNumber: string
  agencyNumber: string
  accountNumber: string
  status: number
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID
}

export class Account extends Entity<AccountProps> {
  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId
    this.touch()
  }

  get bankNumber() {
    return this.props.bankNumber
  }

  set bankNumber(bankNumber: string) {
    this.props.bankNumber = bankNumber
    this.touch()
  }

  get agencyNumber() {
    return this.props.agencyNumber
  }

  set agencyNumber(agencyNumber: string) {
    this.props.agencyNumber = agencyNumber
    this.touch()
  }

  get accountNumber() {
    return this.props.accountNumber
  }

  set accountNumber(accountNumber: string) {
    this.props.accountNumber = accountNumber
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

  get createdBy() {
    return this.props.createdBy
  }

  set createdBy(createdBy: UniqueEntityID) {
    this.props.createdBy = createdBy
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  set updatedBy(updatedBy: UniqueEntityID | undefined) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AccountProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const account = new Account(
      {
        ...props,
        status: props.status ?? AccountStatus.ACTIVE,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return account
  }
}
