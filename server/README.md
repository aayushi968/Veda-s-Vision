# Veda’s Vision Server

## Setup

```bash
cd server
npm install
```

## Environment

Create a `.env` file in `server/` with these values:

```env
# AI provider config (OpenAI-compatible endpoints)
# Default provider is OpenRouter when AI_API_KEY is set
AI_PROVIDER=openrouter
AI_API_KEY=your_provider_api_key
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openrouter/auto

# Optional fallback for direct OpenAI usage
# OPENAI_API_KEY=your_openai_api_key

# Optional metadata for OpenRouter headers
APP_URL=http://localhost:5173
APP_NAME=Vedas Vision

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Free setup example (DeepSeek via OpenRouter)

1. Create a free OpenRouter API key.
2. Set `AI_PROVIDER=openrouter`.
3. Set `AI_API_KEY` to your OpenRouter key.
4. Keep `AI_BASE_URL=https://openrouter.ai/api/v1`.
5. Use `AI_MODEL=openrouter/auto` for best availability, or choose a specific free model such as `deepseek/deepseek-r1:free`.

Health endpoint for AI provider:

`GET /api/health/ai`

## Run locally

```bash
npm run dev
```

## Deployment

Deploy to Render, Railway, or another Node host that supports environment variables. Make sure your backend can access OpenAI and Firebase credentials securely.
