/*
event                            
  ↓
fails 3 times
  ↓
gone forever


event
  ↓
fails repeatedly
  ↓
dead letter queue

*/


import {BaseEvent} from "../events/event.types";

class DeadLetterQueue {
    private failedEvents: BaseEvent[] = [];

    add(event: BaseEvent){
        this.failedEvents.push(event);
    };

    getAll(): BaseEvent[] {
        return this.failedEvents;
    }

}

export const deadLetterQueue = new DeadLetterQueue();