import fs from 'fs/promises';
import path from 'path';
import type {IdempotencyStore} from './idempotency-store.interface';
import type {ProcessedEvent} from './idempotency.types';

export class FileIdempotencyStore implements IdempotencyStore {
    private readonly filePath = path.join(__dirname, 'processed-events.json');

    private async read(): Promise<ProcessedEvent[]>{
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) as ProcessedEvent[];
        } catch (error) {
            return [];
        };
    };

    async hasProcessed(eventId: string): Promise<boolean> {
        const processedEvents = await this.read();
        return processedEvents.some(event => event.eventId === eventId);
    };

    async markProcessed(eventId: string): Promise<void> {
        const processedEvents = await this.read();
        processedEvents.push({eventId, processedAt: Date.now()});
        await fs.writeFile(this.filePath, JSON.stringify(processedEvents, null, 2));
    }
}