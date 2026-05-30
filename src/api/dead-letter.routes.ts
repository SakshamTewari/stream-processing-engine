import express from "express";
import { deadLetterQueue } from "../queue/dead-letter-queue";


export const deadLetterRouter = express.Router();

deadLetterRouter.get('/', (req, res) => {
    res.json({ failed: deadLetterQueue.getAll()})
});