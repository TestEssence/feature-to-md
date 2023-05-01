import { createLogger, transports, format } from "winston";

export const logger = createLogger({
    level: 'info',
    transports: [new transports.Console()],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  });
