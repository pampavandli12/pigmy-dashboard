import { appConfig, type LogLevel } from './constants';

// Ordered from most to least verbose; a message logs only when its level is at
// or above the configured `logLevel`.
const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const threshold = LEVELS[appConfig.logLevel];

const shouldLog = (level: LogLevel): boolean => LEVELS[level] >= threshold;

export const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog('debug')) console.debug(...args);
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) console.info(...args);
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (shouldLog('error')) console.error(...args);
  },
};
