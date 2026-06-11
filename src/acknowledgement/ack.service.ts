/*
ACK logic may include:

Metrics
Tracing
Notifications
Audit Records
Event Chaining
*/

import { getEventStore} from "../event-store/event-store.factory";

export class AckService {
    async acknowledge(eventId: string): Promise<void>{
        const eventStore = getEventStore();
        await eventStore.markCompleted(eventId);
    }
}

export const ackService = new AckService();