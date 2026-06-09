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

        for(const storedEvent of pendingEvents){
            queue.enqueue(storedEvent.event);
        }
        loggingService.info(LOG_COMPONENTS.RECOVERY,`Recovery Completed`, {recoveredEvents: pendingEvents.length});
    }
}

export const recoveryService = new RecoveryService();