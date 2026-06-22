/*
workerLoop
   ↓
dequeue event
   ↓
lookup handler
   ↓
metrics start
   ↓
try handle()
   ↓
success/failure
   ↓
retry if needed
   ↓
metrics end
*/

import { WORKER_CONFIG} from "../config/worker.config";
import {getQueue} from "../queue/queue.factory";
import {eventRegistry} from "../events/event.registry";
import {deadLetterQueue} from "../queue/dead-letter-queue";
import {metricsService} from "../metrics/metrics.service";
import { loggingService } from "../logging/logging.service";
import  { LOG_COMPONENTS } from "../logging/logging.constants";
import {getEventStore} from "../event-store/event-store.factory";
import {WorkerState} from "./worker.types";
import {ackService} from "../acknowledgement/ack.service";
import {idempotencyService} from "../idempotency/idempotency.service";

/*
function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}
*/

export class Worker {
    private state: WorkerState = 'IDLE';
    constructor(private readonly id: number){}

    getId(): number {
        return this.id;
    };

    getState(): WorkerState {
        return this.state;
    };

    async poll(): Promise<void> {
        if(this.state === 'BUSY') return;

        const queue = getQueue();
        const eventStore = getEventStore();
        const event = queue.dequeue();
    

        if(!event) return;

        this.state = 'BUSY';

        await eventStore.markProcessing(event.id);
        
        try {

            // check if duplicate
            const isDuplicate = await idempotencyService.isDuplicate(event.id);
            if(isDuplicate){
                loggingService.warn(LOG_COMPONENTS.WORKER, 'Duplicate event skipped', {workerId: this.id, eventId: event.id, eventType: event.type, correlationId: event.correlationId});
                await ackService.acknowledge(event.id);
                return;
            }

            // handle event
            const handler = eventRegistry[event.type];

            // if no handler found
            if(!handler) {
            loggingService.error(LOG_COMPONENTS.WORKER, 'No handler found', {workerId: this.id,eventId: event.id, eventType: event.type, correlationId: event.correlationId});
            await eventStore.markFailed(event.id);
            return;
            };

            // Process event
            loggingService.info(LOG_COMPONENTS.WORKER, 'Processing Event', {workerId: this.id, eventId: event.id, eventType: event.type, correlationId: event.correlationId});
            await handler.handle(event);
            // await eventStore.remove(event.id);
            // await eventStore.markCompleted(event.id);
            await idempotencyService.markProcessed(event.id);
            await ackService.acknowledge(event.id);
            metricsService.incrementProcessed();
            loggingService.info(LOG_COMPONENTS.WORKER, 'Event Processed', {workerId: this.id, eventId: event.id, eventType: event.type, correlationId: event.correlationId});
            
        } catch(error){
            metricsService.incrementFailed();
            loggingService.error(LOG_COMPONENTS.WORKER, 'Event Processing Failed', {workerId: this.id, eventId: event.id, eventType: event.type, retryCount: event.retryCount, correlationId: event.correlationId, error: error instanceof Error ? error.message : 'Unknown error'});
            event.retryCount++;

            if(event.retryCount <= WORKER_CONFIG.MAX_RETRIES){
                // await eventStore.markPending(event.id);
                await eventStore.scheduleRetry(event.id, event.retryCount);
                metricsService.incrementRetried();
                loggingService.warn(LOG_COMPONENTS.WORKER, 'Retrying Event', {workerId: this.id, eventId: event.id, eventType: event.type, retryCount: event.retryCount});
                // queue.enqueue(event);
            } else {
                await eventStore.markFailed(event.id);
                metricsService.incrementDeadLettered();
                deadLetterQueue.add(event);
                loggingService.error(LOG_COMPONENTS.WORKER, 'Event moved to DLQ', {workerId: this.id,eventId: event.id, eventType: event.type, retryCount: event.retryCount, correlationId: event.correlationId});
            }
        }
        finally {
            this.state = 'IDLE';
        }   
    }
}

