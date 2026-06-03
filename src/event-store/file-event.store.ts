import fs from 'fs/promises';
import path from 'path';
import type {BaseEvent} from "../events/event.types";
import type {EventStore} from "./event-store.interface";

export class FileEventStore implements EventStore {
    private readonly filePath = path.join(process.cwd(), 'events.json');  // process.cwd() => from where node command is run

    private async readEvents(): Promise<BaseEvent[]>{
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    };

    async save(event: BaseEvent) : Promise<void> {
        const events = await this.readEvents();
        events.push(event);
        await fs.writeFile(this.filePath, JSON.stringify(events, null, 2));
    };

    async getAll(): Promise<BaseEvent[]>{
        return this.readEvents();
    };

    async remove(eventId: string): Promise<void>{
        const events = await this.readEvents();
        const filteredEvents = events.filter(event => event.id !== eventId);
        await fs.writeFile(this.filePath, JSON.stringify(filteredEvents, null, 2));
    };
}