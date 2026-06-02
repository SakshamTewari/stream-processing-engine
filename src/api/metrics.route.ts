import express from "express";
import {metricsService} from "../metrics/metrics.service";
import {getQueue} from "../queue/queue.factory";

export const metricsRouter = express.Router();

metricsRouter.get('/', (req,res) => {
    res.json({
        ...metricsService.getMetrics(),
        queueDepth: getQueue().size(),
    })
})