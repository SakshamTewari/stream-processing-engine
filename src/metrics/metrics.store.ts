import { Metrics } from "./metrics.types";

export class MetricsStore  {
    private metrics: Metrics = {
        processed: 0,
        failed: 0,
        retried: 0,
        deadLettered: 0,
        rejected: 0
    };

    getMetrics(): Metrics {
        return this.metrics;
    };
}

export const metricsStore = new MetricsStore();