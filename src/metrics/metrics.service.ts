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

class MetricsService {
    private processedEvents = 0;
    private failedEvents = 0;
    private retriedEvents = 0;
    private deadLetteredEvents = 0;

    incrementProcessed() {
        this.processedEvents++;
    };

    incrementFailed() {

      this.failedEvents++;
   };

   incrementRetried() {

      this.retriedEvents++;
   };

   incrementDeadLettered() {

      this.deadLetteredEvents++;
   };

   getMetrics() {
    return {
        processedEvents : this.processedEvents,
        failedEvents: this.failedEvents,
        retriedEvents: this.retriedEvents,
        deadLetteredEvents: this.deadLetteredEvents,
    };
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