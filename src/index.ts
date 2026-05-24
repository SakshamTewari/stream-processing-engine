import express from 'express';
import {router} from './api/event.routes';
import { startWorker } from './workers/worker';

const PORT = 3000;
const app = express();

app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});

startWorker();