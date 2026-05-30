/*
Worker
  ↓
Queue Interface
  ↓
Queue Factory
  ↓
InMemoryQueue
*/

import {eventQueue} from "./in-memory.queue";
import type {Queue} from "./queue.interface";

export function getQueue(): Queue {
    return eventQueue;
}