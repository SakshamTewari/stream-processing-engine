import express from 'express';
import {router} from './api/event.routes';
import {deadLetterRouter} from "./api/dead-letter.routes";
import {metricsRouter} from "./api/metrics.route";
import {healthRouter} from "./api/health.route";
import {recoveryService} from "./recovery/recovery.service";
import { WorkerPool } from './workers/worker-pool';


const PORT = 3000;
const app = express();
const workerPool = new WorkerPool();
app.use(express.json());

app.use('/api/events', router);
app.use('/api/dead-letters', deadLetterRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/health', healthRouter);


/*
schedule async work
continue execution
run callbacks later
*/

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Recover events from previous runs and enqueue them for processing first
    await recoveryService.recover();
    workerPool.start();
});

