import fs from 'fs/promises';
import path from 'path';
import type {BaseEvent} from "../events/event.types";
import type {EventStore} from "./event-store.interface";
import type {StoredEvent} from "./event-store.types";
import {RECOVERY_CONFIG} from "../recovery/recovery.config";

export class FileEventStore implements EventStore {
    private readonly filePath = path.join(process.cwd(), 'events.json');  // process.cwd() => from where node command is run

    private async readEvents(): Promise<StoredEvent[]>{
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    };

    private async writeEvents(events: StoredEvent[]): Promise<void>{
        await fs.writeFile(this.filePath, JSON.stringify(events, null, 2));
    }

    async save(event: BaseEvent) : Promise<void> {
        const events = await this.readEvents();
        const storedEvent: StoredEvent = {
            event,
            status: 'PENDING',
            storedAt: Date.now(),
            deliveryAttempts: 0,
        }
        events.push(storedEvent);
        await this.writeEvents(events);
    };

    async getAll(): Promise<StoredEvent[]>{
        return this.readEvents();
    };

    async markProcessing(eventId: string): Promise<void>{
        const events = await this.readEvents();
        const event = events.find(e => e.event.id === eventId);
        if(!event) return;
        event.status = 'PROCESSING';
        event.claimedAt = Date.now();
        event.deliveryAttempts++;
        await this.writeEvents(events);
    };

    async markCompleted(eventId: string): Promise<void> {
        const events = await this.readEvents();
        const event = events.find(e => e.event.id === eventId);
        if(!event) return;
        event.status = 'COMPLETED';
        event.completedAt = Date.now();
        await this.writeEvents(events);

    };

    async markFailed(eventId: string): Promise<void> {
        const events = await this.readEvents();
        const event = events.find(e => e.event.id === eventId);
        if(!event) return;
        event.status = 'FAILED';
        await this.writeEvents(events);
    };

    async markPending(eventId: string): Promise<void> {
        const events = await this.readEvents();
        const event = events.find(e => e.event.id === eventId);
        if(!event) return;
        event.status = 'PENDING';
        delete event.claimedAt;
        await this.writeEvents(events);
    };

    async getStaleProcessingEvents(): Promise<StoredEvent[]> {
        const events = await this.readEvents();
        const now = Date.now();
        return events.filter(e => e.status === 'PROCESSING' && e.claimedAt !== undefined && (now - e.claimedAt) > RECOVERY_CONFIG.VISIBILITY_TIMEOUT_MS);
    }

    /*
    async remove(eventId: string): Promise<void>{
        const events = await this.readEvents();
        const filteredEvents = events.filter(event => event.id !== eventId);
        await fs.writeFile(this.filePath, JSON.stringify(filteredEvents, null, 2));
    };
    */
}