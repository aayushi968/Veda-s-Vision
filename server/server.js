import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { assessmentRouter } from './routes/assessmentRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import gamificationRouter from './routes/gamificationRoutes.js';
import userRouter from './routes/userRoutes.js';
import { getAIClient, getAIConfig } from './utils/aiClient.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Veda’s Vision API',
    message: 'Backend is running. Open the frontend at http://localhost:5173.',
    endpoints: ['/api/health', '/api/health/ai', '/api/chat', '/api/assessment'],
  });
});

app.use('/api/assessment', assessmentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/user', userRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Veda’s Vision API' });
});

async function handleAIHealth(req, res) {
  let config;

  try {
    config = getAIConfig();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      service: 'ai',
      message: error.message,
    });
  }

  try {
    const client = getAIClient();
    const candidates = config.modelCandidates || [config.model];
    let modelUsed = config.model;
    let lastError;

    for (const candidateModel of candidates) {
      try {
        // Provider-agnostic check using a tiny completion request.
        await client.chat.completions.create({
          model: candidateModel,
          messages: [{ role: 'user', content: 'Reply with OK' }],
          max_tokens: 5,
          temperature: 0,
        });
        modelUsed = candidateModel;
        lastError = null;
        break;
      } catch (error) {
        const status = error?.status || error?.code;
        const message = String(error?.message || '').toLowerCase();
        const isEndpointUnavailable =
          String(status) === '404' ||
          message.includes('no endpoints found for') ||
          message.includes('model not found') ||
          message.includes('no provider available');

        lastError = error;
        if (isEndpointUnavailable) {
          continue;
        }
        throw error;
      }
    }

    if (lastError) {
      throw lastError;
    }

    return res.json({
      status: 'ok',
      service: 'ai',
      provider: config.provider,
      model: modelUsed,
      message: 'AI provider is reachable and credentials are valid.',
    });
  } catch (error) {
    const statusCode = error?.status || 500;
    const message = error?.message || 'AI health check failed.';

    if (statusCode === 401) {
      return res.status(401).json({
        status: 'error',
        service: 'ai',
        provider: config.provider,
        message: 'AI API key is invalid or unauthorized.',
      });
    }

    if (
      statusCode === 429 ||
      message.toLowerCase().includes('quota') ||
      message.toLowerCase().includes('rate limit')
    ) {
      return res.status(429).json({
        status: 'degraded',
        service: 'ai',
        provider: config.provider,
        message: 'AI provider quota/rate limit reached. Try a free model or wait before retrying.',
      });
    }

    return res.status(500).json({
      status: 'error',
      service: 'ai',
      provider: config.provider,
      message,
    });
  }
}

app.get('/api/health/ai', handleAIHealth);
app.get('/api/health/openai', handleAIHealth);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
