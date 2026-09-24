/**
 * Tiny logger that respects env.logLevel.
 *
 * No deps — just `console` so we don't pull pino into a mobile suite.
 */
import { env } from '../config/env.config';

type Level = 'debug' | 'info' | 'warn' | 'error';
const order: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function shouldLog(level: Level): boolean {
  const current = (env.logLevel as Level) ?? 'info';
  return order[level] >= order[current];
}

export const logger = {
  debug(msg: string, ...args: unknown[]): void {
    if (shouldLog('debug')) console.log(`[debug] ${msg}`, ...args);
  },
  info(msg: string, ...args: unknown[]): void {
    if (shouldLog('info')) console.log(`[info]  ${msg}`, ...args);
  },
  warn(msg: string, ...args: unknown[]): void {
    if (shouldLog('warn')) console.warn(`[warn]  ${msg}`, ...args);
  },
  error(msg: string, ...args: unknown[]): void {
    if (shouldLog('error')) console.error(`[error] ${msg}`, ...args);
  },
};
