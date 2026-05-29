import {EventHandler} from './event-handler.interface';
import {BaseEvent} from '../events/event.types';
import {TaskPayload} from '../events/payloads/task.payload';

export class TaskCreatedHandler implements EventHandler<TaskPayload>{

    // override
    async handle(event: BaseEvent<TaskPayload>): Promise<void>{
        console.log(`[TASK RECEIVED] ${event.payload.title}`);
        console.log(`[TASK ID] ${event.payload.taskId}`);
    };

    // future business logic
}