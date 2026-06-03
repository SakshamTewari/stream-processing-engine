import type {EventStore} from "./event-store.interface";
import {FileEventStore} from "./file-event.store";

export function getEventStore(): EventStore {
    return new FileEventStore();;
}