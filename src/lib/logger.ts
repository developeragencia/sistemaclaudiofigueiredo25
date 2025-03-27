type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  details: Record<string, any>;
  userId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  constructor() {
    // Limpar logs antigos periodicamente
    setInterval(() => this.cleanup(), 24 * 60 * 60 * 1000); // 24 horas
  }

  private cleanup() {
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }
  }

  private createLogEntry(
    level: LogLevel,
    event: string,
    details: Record<string, any>,
    userId?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      event,
      details,
      userId,
    };
  }

  info(event: string, details: Record<string, any> = {}, userId?: string) {
    const entry = this.createLogEntry('info', event, details, userId);
    this.logs.push(entry);
    this.persist(entry);
  }

  warn(event: string, details: Record<string, any> = {}, userId?: string) {
    const entry = this.createLogEntry('warn', event, details, userId);
    this.logs.push(entry);
    this.persist(entry);
  }

  error(event: string, details: Record<string, any> = {}, userId?: string) {
    const entry = this.createLogEntry('error', event, details, userId);
    this.logs.push(entry);
    this.persist(entry);
  }

  private persist(entry: LogEntry) {
    // Em desenvolvimento, exibir no console
    if (import.meta.env.DEV) {
      const { level, event, details, userId } = entry;
      console[level](
        `[${event}]${userId ? ` [User: ${userId}]` : ''}:`,
        details
      );
    }

    // Em produção, enviar para um serviço de logging
    if (import.meta.env.PROD) {
      // TODO: Implementar integração com serviço de logging
      // Por exemplo: Sentry, LogRocket, etc.
    }
  }

  getLogs(
    options: {
      level?: LogLevel;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): LogEntry[] {
    let filtered = this.logs;

    if (options.level) {
      filtered = filtered.filter(log => log.level === options.level);
    }

    if (options.userId) {
      filtered = filtered.filter(log => log.userId === options.userId);
    }

    if (options.startDate) {
      filtered = filtered.filter(
        log => new Date(log.timestamp) >= options.startDate!
      );
    }

    if (options.endDate) {
      filtered = filtered.filter(
        log => new Date(log.timestamp) <= options.endDate!
      );
    }

    return filtered;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger(); 