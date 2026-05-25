import express from 'express';
import { eventQueue } from '../queue/in-memory.queue';
import type { Event } from '../events/event.types';

export const router = express.Router();

router.post('/events', (req, res) => {
    const event: Event = {
        id: crypto.randomUUID(),
        payload: {
            eventId: req.body.eventId,
            title: req.body.title,
        },
        createdAt: Date.now(),
        retryCount:0,
    };
    eventQueue.enqueue(event);
    console.log(`[API] queued ${event.id}`);
    
    res.json({ success: true, queued: event.id});
});