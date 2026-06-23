import type {BaseEvent} from '../events/event.types';
import type {Queue} from './queue.interface';

export class InMemoryQueue implements Queue{
    private queue: BaseEvent[] = [];
    private readonly maxSize: number = 1000;

    enqueue(event: BaseEvent): boolean{
        if (this.queue.length >= this.maxSize) {
            return false;
        }
        this.queue.push(event);
        return true;
    };

    dequeue(): BaseEvent | undefined {
        return this.queue.shift();
    };

    size(): number {
        return this.queue.length;
    };

    isFull(): boolean {
        return this.queue.length >= this.maxSize;
    }
}

export const eventQueue = new InMemoryQueue();