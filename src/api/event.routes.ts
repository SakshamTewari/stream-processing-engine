import express from 'express';
import { eventQueue } from '../queue/in-memory.queue';
import type {BaseEvent } from '../events/event.types';
import {eventValidatorRegistry} from "../events/event-validator.registry";


export const router = express.Router();

router.post('/events', (req, res) => {
    const {type, payload} = req.body;
    const validator = eventValidatorRegistry[type];
    if(!validator) return res.status(400).json({success: false, message:"Unknown event type"});
    if( !validator.validate(payload)) return res.json({success: false, message: "Invalid payload"});


    const event: BaseEvent = {
        id: crypto.randomUUID(),
        type,
        payload,
        createdAt: Date.now(),
        retryCount:0,
    };

    
    eventQueue.enqueue(event);
    console.log(`[API] queued ${event.id}`);
    
    res.json({ success: true, queued: event.id});
});