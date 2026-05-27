/*
API
  ↓
Queue
  ↓
Worker
  ↓
Registry
  ↓
Handler
  ↓
Business Logic
*/


import {EventHandler} from '../handlers/event-handler.interface';
import {TaskCreatedHandler} from '../handlers/task-created.handler';

export const eventRegistry : Record<string, EventHandler> = {
    TASK_CREATED: new TaskCreatedHandler()
};
