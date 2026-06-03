/*
API
 ↓
Event Store
 ↓
Queue
 ↓
Worker
 ↓
Event Store Cleanup
*/


import { BaseEvent } from "../events/event.types";

export interface EventStore {
    save(event: BaseEvent) : Promise<void>;
    getAll(): Promise<BaseEvent[]>;
    remove(eventId: string): Promise<void>;
}