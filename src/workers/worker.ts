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

/*
function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}
*/


export async function processNextEvent(): Promise<void>{
   

    const queue = getQueue();
    const eventStore = getEventStore();
    const event = queue.dequeue();

    if(!event) return;

        
    const handler = eventRegistry[event.type];

    if(!handler) {
        loggingService.error(LOG_COMPONENTS.WORKER, 'No handler found', {eventId: event.id, eventType: event.type});
        return;
    }

    try {
        loggingService.info(LOG_COMPONENTS.WORKER, 'Processing Event', {eventId: event.id, eventType: event.type});
        await handler.handle(event);
        await eventStore.remove(event.id);
        metricsService.incrementProcessed();
        loggingService.info(LOG_COMPONENTS.WORKER, 'Event Processed', {eventId: event.id, eventType: event.type});
        
    } catch(error){
        metricsService.incrementFailed();
        loggingService.error(LOG_COMPONENTS.WORKER, 'Event Processing Failed', {eventId: event.id, eventType: event.type, retryCount: event.retryCount, error: error instanceof Error ? error.message : 'Unknown error'});
        event.retryCount++;

        if(event.retryCount <= WORKER_CONFIG.MAX_RETRIES){
            metricsService.incrementRetried();
            loggingService.warn(LOG_COMPONENTS.WORKER, 'Retrying Event', {eventId: event.id, eventType: event.type, retryCount: event.retryCount});
            queue.enqueue(event);
        } else {
            metricsService.incrementDeadLettered();
            deadLetterQueue.add(event);
            loggingService.error(LOG_COMPONENTS.WORKER, 'Event moved to DLQ', {eventId: event.id, eventType: event.type, retryCount: event.retryCount});
        }
    };   
}