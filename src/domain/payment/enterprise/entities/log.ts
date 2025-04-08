import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface LogProps {
  process: string
  value: string
  oldValue?: string | null
  timestamp: Date
  level: number
  userId: UniqueEntityID
  note?: string | null
}

export class Log extends Entity<LogProps> {
  get process() {
    return this.props.process
  }

  set process(process: string) {
    this.props.process = process
  }

  get value() {
    return this.props.value
  }

  set value(value: string) {
    this.props.value = value
  }

  get oldValue() {
    return this.props.oldValue
  }

  set oldValue(oldValue: string | undefined | null) {
    this.props.oldValue = oldValue
  }

  get timestamp() {
    return this.props.timestamp
  }

  get level() {
    return this.props.level
  }

  set level(level: number) {
    this.props.level = level
  }

  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId
  }

  get note() {
    return this.props.note
  }

  set note(note: string | undefined | null) {
    this.props.note = note
  }

  static create(props: Optional<LogProps, 'timestamp'>, id?: UniqueEntityID) {
    const log = new Log(
      {
        ...props,
        timestamp: props.timestamp ?? new Date(),
      },
      id,
    )

    return log
  }
}
