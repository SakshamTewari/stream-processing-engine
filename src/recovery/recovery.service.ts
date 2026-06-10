/*
Startup
 ↓
Read EventStore
 ↓
Find PENDING events
 ↓
Enqueue them
 ↓
Workers continue processing
*/

import {getEventStore} from "../event-store/event-store.factory";
import {getQueue} from '../queue/queue.factory';
import {loggingService} from "../logging/logging.service";
import { LOG_COMPONENTS } from "../logging/logging.constants";


export class RecoveryService {

    async recover(): Promise<void> {
        const eventStore = getEventStore();
        const queue = getQueue();
        const events = await eventStore.getAll();

        const pendingEvents = events.filter(e => e.status === 'PENDING');
        const staleProcessingEvents = await eventStore.getStaleProcessingEvents();

        for(const storedEvent of pendingEvents){
            queue.enqueue(storedEvent.event);
        };

        for(const storedEvent of staleProcessingEvents){
            await eventStore.markPending(storedEvent.event.id);
            queue.enqueue(storedEvent.event);
            loggingService.warn(LOG_COMPONENTS.RECOVERY,`Reclaimed Stale Processing Event`, {staleProcessingEvent: storedEvent.event.id, eventName: storedEvent.event.payload.title});
        };

        
        loggingService.info(LOG_COMPONENTS.RECOVERY,`Recovery Completed`, {recoveredEvents: pendingEvents.length});
    }
}

export const recoveryService = new RecoveryService();