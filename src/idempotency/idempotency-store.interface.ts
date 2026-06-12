/*
Later

File
Redis
Postgres
DynamoDB
*/

export interface IdempotencyStore {
    hasProcessed(eventId: string) : Promise<boolean>;
    markProcessed(eventID: string) : Promise<void>;
}