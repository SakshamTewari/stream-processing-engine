export interface Event {
    id: string;
    payload: {
        eventId: string;
        title: string;
    }
    createdAt: number;
    retryCount: number;
}


// Generic Event Handler Interface

export interface BaseEvent<T = any>{
    id: string;
    type: string;
    payload: T;
    createdAt: number;
    retryCount: number;
}