import type { BaseEvent } from "../events/event.types";

function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function processEvent(event: BaseEvent) {

    console.log(`[PROCESSING TASK] ${event.payload.title}`);

    await sleep(1000); // simulate processing time

    const randomFailure = Math.random() < 0.2;

    if(randomFailure){
        throw new Error('Random failure');
    }

    console.log(`[TASK COMPLETED] ${event.payload.eventId}`);
    
}