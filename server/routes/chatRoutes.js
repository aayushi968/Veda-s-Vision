import express from 'express';
import { handleChat } from '../controllers/chatController.js';

export const chatRouter = express.Router();
chatRouter.post('/', handleChat);
