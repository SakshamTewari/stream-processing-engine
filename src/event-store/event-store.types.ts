import {BaseEvent} from "../events/event.types";
import {EventStatus} from "../events/event-status.types";

export interface StoredEvent {
    event: BaseEvent;
    status: EventStatus;
    storedAt: number;
    claimedAt?: number;
    completedAt?: number;
    deliveryAttempts: number;
}