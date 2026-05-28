// Generic Event Handler Interface

export interface BaseEvent<T = any>{
    id: string;
    type: string;
    payload: T;
    createdAt: number;
    retryCount: number;
}