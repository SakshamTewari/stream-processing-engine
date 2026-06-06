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
import { StoredEvent } from "./event-store.types";

export interface EventStore {
    save(event: BaseEvent) : Promise<void>;
    getAll(): Promise<StoredEvent[]>;
    markProcessing(eventId: string): Promise<void>;
    markCompleted(eventId: string): Promise<void>;
    markFailed(eventId: string): Promise<void>;
    // remove(eventId: string): Promise<void>;    not needed now as we have EventStatus now
}