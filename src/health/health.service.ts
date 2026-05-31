import {getQueue} from "../queue/queue.factory";
import { HEALTH_THRESHOLDS } from "./health.constants";
import { HealthStatus } from "./health.types";

export class HealthService {
    getStatus() {
        const queue = getQueue();
        const queueDepth = queue.size();
        const status : HealthStatus = queueDepth > HEALTH_THRESHOLDS.DEGRADED_QUEUE_DEPTH ? 'DEGRADED' : 'UP';

        return {
            status, 
            timestamp: new Date().toISOString(),
            queueDepth,
        }
    }
}

export const healthService = new HealthService();