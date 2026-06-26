/*
Later, below services can hook into same layer

Prometheus
Datadog
OpenTelemetry
CloudWatch

Request
  ↓
Queue
  ↓
Worker
  ↓
Handler
  ↓
Metrics Service
  ↓
Metrics API
*/

import { metricsStore } from "./metrics.store";
import { Metrics } from "./metrics.types";

class MetricsService {

    incrementProcessed() {
        metricsStore.getMetrics().processed++;
    };

    incrementFailed() {
      metricsStore.getMetrics().failed++;
   };

   incrementRetried() {
      metricsStore.getMetrics().retried++;
   };

   incrementDeadLettered() {
      metricsStore.getMetrics().deadLettered++;
   };

   incrementRejected() {
      metricsStore.getMetrics().rejected++;
   };

   getMetrics(): Metrics {
    return metricsStore.getMetrics();
   };
};

export const metricsService = new MetricsService();

/*
Worker
 ↓
Logger Service
 ↓
Pino
 ↓
ElasticSearch
*/