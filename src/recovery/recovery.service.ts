/*
POST Event
      ↓
 Event Store
      ↓
    Queue
      ↓
   Worker
      ↓
  Handler

Application Startup
      ↓
 Recovery Service
      ↓
 Event Store
      ↓
    Queue
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

        for(const event of events){
            queue.enqueue(event);
        }
        loggingService.info(LOG_COMPONENTS.RECOVERY,`Recovered ${events.length} events and enqueued them for processing`);
    }
}

export const recoveryService = new RecoveryService();