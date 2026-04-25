import express from 'express';
import { submitAssessment, getHistory } from '../controllers/assessmentController.js';

export const assessmentRouter = express.Router();
assessmentRouter.post('/', submitAssessment);
assessmentRouter.get('/', getHistory);
