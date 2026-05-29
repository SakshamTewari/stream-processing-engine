import {EventValidator} from "./event-validator.interface";
import {TaskPayload} from "../events/payloads/task.payload";

export class TaskCreatedValidator implements EventValidator {
    validate(payload: TaskPayload) : boolean {
        if(!payload.taskId || !payload.title) return false;
        return true;
    }
}