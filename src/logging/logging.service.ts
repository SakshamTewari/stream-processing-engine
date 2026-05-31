import type { LogLevel } from "./logging.types";

export class LoggingService {
    private log(level: LogLevel, component: string, message: string, metadata?: Record<string, unknown>): void {
        console.log(JSON.stringify({
            timestamp: new Date().toISOString,
            level,
            component,
            message,
            ...(metadata ?? {}),
        }));
    };

    info(component: string, message: string, metadata? : Record<string, unknown>): void {
        this.log('INFO', component, message, metadata);
    };

    warn(component: string, message: string, metadata? : Record<string, unknown>): void {
        this.log('WARN', component, message, metadata);
    };

    error(component: string, message: string, metadata? : Record<string, unknown>): void {
        this.log('ERROR', component, message, metadata);
    };

}

export const loggingService = new LoggingService();