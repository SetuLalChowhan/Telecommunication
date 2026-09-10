import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class StructuredLogger extends ConsoleLogger {
  protected formatPid(pid: number): string {
    return `[TeleAPI ${pid}]`;
  }

  log(message: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV === 'production') {
      this.writeJson('log', message, optionalParams);
    } else {
      super.log(message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV === 'production') {
      this.writeJson('error', message, optionalParams);
    } else {
      super.error(message, ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV === 'production') {
      this.writeJson('warn', message, optionalParams);
    } else {
      super.warn(message, ...optionalParams);
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV === 'production') {
      this.writeJson('debug', message, optionalParams);
    } else {
      super.debug(message, ...optionalParams);
    }
  }

  private writeJson(level: LogLevel, message: any, params: any[]) {
    const context = params.length > 0 && typeof params[params.length - 1] === 'string'
      ? params[params.length - 1]
      : this.context;

    const stack = params.find((p) => typeof p === 'string' && p.includes('\n'));

    const logObject = {
      level,
      timestamp: new Date().toISOString(),
      context: context || 'Application',
      message: typeof message === 'object' ? message : String(message),
      ...(stack ? { stack } : {}),
    };

    process.stdout.write(JSON.stringify(logObject) + '\n');
  }
}
