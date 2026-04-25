import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import express from 'express';
import cors from 'cors';
import { assessmentRouter } from '../server/routes/assessmentRoutes.js';
import { chatRouter } from '../server/routes/chatRoutes.js';
import gamificationRouter from '../server/routes/gamificationRoutes.js';
import userRouter from '../server/routes/userRoutes.js';

setGlobalOptions({ maxInstances: 10 });

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

app.use('/api/assessment', assessmentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/user', userRouter);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export const api = onRequest(app);
