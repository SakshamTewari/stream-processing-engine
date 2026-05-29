/*
event type
   ↓
registry
   ↓
validator
*/

import {EventValidator} from "../validators/event-validator.interface";
import {TaskCreatedValidator} from "../validators/task-created.validator";

export const eventValidatorRegistry: Record<string, EventValidator> = {
    TASK_CREATED: new TaskCreatedValidator()
};