import type {BaseEvent} from '../events/event.types';
import type {Queue} from './queue.interface';

export class InMemoryQueue implements Queue{
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