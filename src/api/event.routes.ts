import express from 'express';
import { eventQueue } from '../queue/in-memory.queue';
import type { Event, BaseEvent } from '../events/event.types';
import type { TaskPayload} from '../events/payloads/task.payload';

export const router = express.Router();

router.post('/events', (req, res) => {
    const {taskId, title} = req.body;
    const event: BaseEvent<TaskPayload> = {
        id: crypto.randomUUID(),
        type: 'TASK_CREATED',
        payload: {
            taskId,
            title
        },
        createdAt: Date.now(),
        retryCount:0,
    };
    eventQueue.enqueue(event);
    console.log(`[API] queued ${event.id}`);
    
    res.json({ success: true, queued: event.id});
});