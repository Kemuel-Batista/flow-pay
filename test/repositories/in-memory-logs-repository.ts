import { LogsRepository } from '@/domain/payment/application/repositories/logs-repository'
import { Log } from '@/domain/payment/enterprise/entities/log'

export class InMemoryLogsRepository implements LogsRepository {
  public items: Log[] = []

  async create(log: Log): Promise<void> {
    this.items.push(log)
  }
}
