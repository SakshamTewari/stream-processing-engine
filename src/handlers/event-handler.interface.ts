import {BaseEvent} from "../events/event.types";

/*
Orchestration

receive event
find handler
execute handler
*/

export interface EventHandler<T = any>{
    handle(
        event: BaseEvent<T>
    ) : Promise<void>;
}