/*
             Worker-1
           ↗
Queue  →  Worker-2
           ↘
             Worker-3
               ↘
                Worker-4
*/

import {WORKER_CONFIG} from "../config/worker.config";
import {processNextEvent} from "./worker";
import {loggingService} from "../logging/logging.service";
import {LOG_COMPONENTS} from "../logging/logging.constants";

export function startWorkerPool(): void {
    // start multiple worker instances to process events from the queue
    for(let i = 0; i < WORKER_CONFIG.WORKER_COUNT; i++ ){
        setInterval(processNextEvent, WORKER_CONFIG.POLL_INTERVAL_MS);

        loggingService.info(LOG_COMPONENTS.WORKER_POOL, `Started worker instance ${i+1}`);
    };
};


/*
Future Enhancements:

start()
stop()
pause()
resume()
health checks
worker metrics
*/