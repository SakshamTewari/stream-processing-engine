import type {BaseEvent} from '../events/event.types';

export class InMemoryQueue {
    private queue: BaseEvent[] = [];

    enqueue(event: BaseEvent){
        this.queue.push(event);
    }

    dequeue(): BaseEvent | undefined {
        return this.queue.shift();
    }

    size(): number {
        return this.queue.length;
    }
}

export const eventQueue = new InMemoryQueue();