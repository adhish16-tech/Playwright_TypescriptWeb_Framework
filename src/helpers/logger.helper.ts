import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

export class Logger {
  private readonly logger: WinstonLogger;

  constructor(context: string) {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level}] [${context}] ${message}`;
        })
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: 'test-results/logs/test.log',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string, error?: unknown): void {
    const errorMsg = error instanceof Error ? error.message : String(error ?? '');
    this.logger.error(`${message}${errorMsg ? ` | ${errorMsg}` : ''}`);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }
}
