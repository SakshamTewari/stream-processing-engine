export interface Metrics {
    processed: number;
    failed: number;
    retried: number;
    deadLettered: number;
    rejected: number;
}