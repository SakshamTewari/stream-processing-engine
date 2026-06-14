/*
dequeue
 ↓
duplicate check
 ↓
handler
 ↓
mark processed
 ↓
ack
*/


import {getIdempotencyStore} from './idempotency.factory';
 
export class IdempotencyService {
    async isDuplicate(eventId: string) : Promise<boolean> {
        return await getIdempotencyStore().hasProcessed(eventId);
    };

    async markProcessed(eventId: string) : Promise<void> {
        await getIdempotencyStore().markProcessed(eventId);
    };
};

export const idempotencyService = new IdempotencyService();