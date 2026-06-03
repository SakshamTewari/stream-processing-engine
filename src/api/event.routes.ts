import express from 'express';
import { eventQueue } from '../queue/in-memory.queue';
import type {BaseEvent } from '../events/event.types';
import {eventValidatorRegistry} from "../events/event-validator.registry";
import {getEventStore} from "../event-store/event-store.factory"; 


export const router = express.Router();

router.post('/', async (req, res) => {
    console.log(req.body);
    
    const {type, payload} = req.body;
    console.log(type, payload);
    if (!type || !payload) return res.status(400).json({success: false, message:"type and payload required"});

    const validator = eventValidatorRegistry[type];
    if(!validator) return res.status(400).json({success: false, message:"Unknown event type"});
    if( !validator.validate(payload)) return res.status(400).json({success: false, message: "Invalid payload"});


    const event: BaseEvent = {
        id: crypto.randomUUID(),
        type,
        payload,
        createdAt: Date.now(),
        retryCount:0,
    };

    // For persistence, store the event in event store before enqueueing
    const eventStore = getEventStore();
    await eventStore.save(event);

    // enqueue the event for processing
    eventQueue.enqueue(event);

    console.log(`[API] queued ${event.id}`);
    
    res.json({ success: true, queued: event.id});
});