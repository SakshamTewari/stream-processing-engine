import type {BaseEvent} from "../events/event.types";

export interface Queue {
    enqueue(event: BaseEvent): boolean;
    dequeue(): BaseEvent | undefined;
    size(): number;
    isFull(): boolean;
}