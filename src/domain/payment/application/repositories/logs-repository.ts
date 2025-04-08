import { Log } from '../../enterprise/entities/log'

export abstract class LogsRepository {
  abstract create(log: Log): Promise<void>
}
