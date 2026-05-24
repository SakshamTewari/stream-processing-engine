# Stream Processing Engine

A scalable event-driven stream processing engine built with:

- TypeScript
- Node.js
- Express
- Worker-based Processing
- In-Memory Streaming Queue

The system is designed around asynchronous event processing and modular stream orchestration, with an architecture that can evolve toward distributed stream processing platforms such as:

- Kafka
- RabbitMQ
- Redis Streams
- Apache Flink
- Spark Streaming

---

# Architecture

```txt
Client/API Request
        │
        ▼
  Express Route
        │
        ▼
   Event Producer
        │
        ▼
   Stream Queue
        │
        ▼
     Workers
        │
        ▼
 Event Handlers
        │
        ▼
 Metrics / Logs / Sinks
```

---

# System Design Goals

- Event-driven architecture
- Decoupled processing pipeline
- Horizontal scalability
- Background task execution
- Retry and failure handling
- Stream-oriented processing
- Extensible worker infrastructure
- Modular event orchestration

---

# Project Structure

```txt
stream-processing-engine/
│
├── package.json
├── tsconfig.json
├── README.md
│
└── src/
    │
    ├── index.ts
    │
    ├── api/
    │   └── event.routes.ts
    │
    ├── events/
    │   └── event.types.ts
    │
    ├── handlers/
    │   └── event.handler.ts
    │
    ├── metrics/
    │   └── metrics.store.ts
    │
    ├── queue/
    │   └── in-memory.queue.ts
    │
    └── workers/
        └── worker.ts
```

---

# Core Components

## Producer

The API layer acts as an event producer.

Incoming requests are transformed into stream events and pushed into the processing queue.

Example:

```txt
POST /api/events
```

---

## Stream Queue

The queue acts as the transport and buffering layer between producers and consumers.

Responsibilities:

- Event buffering
- Decoupling producers and workers
- Temporary event storage
- Load absorption during traffic spikes

Current implementation:

```txt
In-Memory Queue
```

Future integrations:

- Kafka
- RabbitMQ
- Redis Streams

---

## Workers

Workers continuously consume events from the queue.

Responsibilities:

- Poll events
- Trigger handlers
- Manage retries
- Handle failures
- Maintain processing lifecycle

Workers simulate production-grade stream consumers.

---

## Handlers

Handlers contain business processing logic.

Examples:

- Notification processing
- Payment execution
- Analytics computation
- Document generation
- Event transformation

Workers orchestrate processing, while handlers execute domain logic.

---

## Metrics Layer

Tracks operational metrics such as:

- Processed events
- Failed events
- Retry attempts
- Queue size
- Worker activity

This layer can later evolve into:

- Prometheus
- Grafana
- OpenTelemetry

---

# Event Processing Flow

```txt
Client
  │
  ▼
POST /api/events
  │
  ▼
Route Handler
  │
  ▼
Create Event
  │
  ▼
Push To Queue
  │
  ▼
Worker Polls Queue
  │
  ▼
Handler Executes Logic
  │
  ▼
Success / Retry / Failure
```

---

# Installation

## Clone Repository

```bash
git clone <repo-url>
```

---

## Install Dependencies

```bash
npm install
```



---

# Running The Engine

## Development Mode

```bash
npm run dev
```


---

# API Testing

## Create Event

```bash
curl -X POST \
http://localhost:3000/api/events \
-H "Content-Type: application/json" \
-d '{
  "eventId":"event-1",
  "title":"Generate Invoice"
}'
```

---

# Expected Output

```txt
[API]
queued event-123

[worker-1]
processing event-123

[EVENT RECEIVED]
Generate Invoice

[EVENT COMPLETED]
task-1

[METRICS]
processed=1
failed=0
retried=0
queue=0
```

---

# Planned Extensions

- Multiple event types
- Generic `BaseEvent<T>`
- Dead Letter Queue (DLQ)
- Persistent event storage
- Kafka integration
- Distributed worker nodes
- Batch processing
- Stream operators
- Window-based processing
- Event replay
- Backpressure handling
- Priority queues
- Event partitioning
- Consumer groups
- Rate limiting
- Monitoring dashboards
- OpenTelemetry integration
- Event persistence and recovery
- Horizontal scaling support

---

# Architectural Overview

The engine follows an event-driven asynchronous processing model.

Instead of:

```txt
API → Direct Processing
```

the system uses:

```txt
API → Queue → Workers → Handlers
```

This separation enables:

- scalability
- fault tolerance
- retry mechanisms
- asynchronous execution
- distributed processing
- decoupled system architecture