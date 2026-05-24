export interface Event {
    id: string;
    payload: {
        eventId: string;
        title: string;
    }
    createdAt: number;
    retryCount: number;
}