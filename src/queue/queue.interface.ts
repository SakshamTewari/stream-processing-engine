import type {BaseEvent} from "../events/event.types";

export interface Queue {
    enqueue(event: BaseEvent): void;
    dequeue(): BaseEvent | undefined;
    size(): number;
}