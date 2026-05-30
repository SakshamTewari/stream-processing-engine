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
import { eventQueue } from "../queue/in-memory.queue";
import {eventRegistry} from "../events/event.registry";
import {deadLetterQueue} from "../queue/dead-letter-queue";

/*
function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}
*/


export async function startWorker(){
    console.log("[WORKER] Started");
    setInterval( async () => {
        const event = eventQueue.dequeue();

        if(!event) return;

        console.log(`[WORKER] processing ${event.id}`);

        const handler = eventRegistry[event.type];

        if(!handler) {
            console.log(`[WORKER] No handler found for ${event.type}`);
            return;
        }

        try {
        await handler.handle(event);
        console.log(`[WORKER] Successfully processed ${event.id}`);
        } catch(error){
            console.log(`[WORKER] Error Processing ${event.id}: ${error}`);
            event.retryCount++;
            if(event.retryCount <= WORKER_CONFIG.MAX_RETRIES){
                console.log(`[WORKER] Retrying ${event.id} (Attempt ${event.retryCount})`);
                eventQueue.enqueue(event);
            } else {
                deadLetterQueue.add(event);
                console.log(`[WORKER] Dead-Lettered ${event.id}`);
            }
        }

    }, WORKER_CONFIG.POLL_INTERVAL_MS);
}