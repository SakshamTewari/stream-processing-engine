import express from 'express';
import {router} from './api/event.routes';
import {deadLetterRouter} from "./api/dead-letter.routes";
import {metricsRouter} from "./api/metrics.route";
import { startWorker } from './workers/worker';


const PORT = 3000;
const app = express();

app.use(express.json());

app.use('/api/events', router);
app.use('/api/dead-letters', deadLetterRouter);
app.use('/api/metrics', metricsRouter);


/*
schedule async work
continue execution
run callbacks later
*/

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
    startWorker();
});

