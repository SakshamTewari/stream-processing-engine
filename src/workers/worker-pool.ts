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
import {Worker} from "./worker";
import {loggingService} from "../logging/logging.service";
import {LOG_COMPONENTS} from "../logging/logging.constants";

export class WorkerPool {
  private readonly workers: Worker[] = [];

  start(): void {
    for(let i = 0; i < WORKER_CONFIG.WORKER_COUNT; i++ ){
      const worker = new Worker(i+1);
      this.workers.push(worker);
        setInterval(() => worker.poll(), WORKER_CONFIG.POLL_INTERVAL_MS);
        loggingService.info(LOG_COMPONENTS.WORKER_POOL, `Started worker instance ${i+1}`);
    };
  };

  getWorkers(): Worker[] {
    return this.workers;
  }
}
/*
Future Enhancements:

start()
stop()
pause()
resume()
health checks
worker metrics
*/