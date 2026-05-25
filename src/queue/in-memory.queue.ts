import type {Event} from '../events/event.types';

export class InMemoryQueue {
    private queue: Event[] = [];

    enqueue(event: Event){
        this.queue.push(event);
    }

    dequeue(): Event | undefined {
        return this.queue.shift();
    }

    size(): number {
        return this.queue.length;
    }
}

export const eventQueue = new InMemoryQueue();