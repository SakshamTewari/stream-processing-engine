import express from 'express';
import {healthService} from "../health/health.service";

export const healthRouter = express.Router();

healthRouter.get('/', (req,res) => {
    res.json(healthService.getStatus());
});