import { WinstonModule, WinstonModuleOptions } from 'nest-winston'
import { transports, format, config } from 'winston'
import 'winston-daily-rotate-file'

export const winstonConfig: WinstonModuleOptions = {
  levels: config.npm.levels,
  level: 'verbose',
  transports: [
    new transports.DailyRotateFile({
      level: 'error',
      filename: `logs/%DATE%-error.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '2d',
    }),
    new transports.DailyRotateFile({
      level: 'warn',
      filename: `logs/%DATE%-warn.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '2d',
    }),
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`
        }),
      ),
    }),
  ],
}

export const logger = WinstonModule.createLogger(winstonConfig)
