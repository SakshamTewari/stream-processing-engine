export type LogLevel = 
    | 'INFO' 
    | 'WARN' 
    | 'ERROR';

export type LogComponent =
    | 'API'
    | 'WORKER'
    | 'QUEUE'
    | 'EVENT_STORE'
    | 'DLQ';