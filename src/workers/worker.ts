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


import { eventQueue } from "../queue/in-memory.queue";
import { processEvent } from "../handlers/event.handlers";
import { metrics } from "../metrics/metrics.store";
import {eventRegistry} from "../events/event.registry";


function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function workerLoop(workerName: string){
    while(true){
        const event = eventQueue.dequeue();

        if(!event){
            await sleep(500); // wait before checking for new events
            continue;
        }

        try {
            console.log(`[${workerName}] processing ${event.id}`);
            await processEvent(event);
            metrics.processed++;
        } catch(err){
            metrics.failed++;
            if(event.retryCount < 3){
                event.retryCount++;
                metrics.retried++;
                console.log(`[${workerName} retrying ${event.id}]`);
                eventQueue.enqueue(event);
            } else {
                console.log(`[DEAD LETTER QUEUE] ${event.id} failed permanently`);
            }
        }
        console.log(`[METRICS] processed=${metrics.processed} ||| failed=${metrics.failed} ||| retried=${metrics.retried} ||| queue=${eventQueue.size()}`);
    }
}

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

        await handler.handle(event);

    }, 1000);
}