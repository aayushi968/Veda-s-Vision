import { OpenAI } from 'openai';

const OPENROUTER_FALLBACK_MODELS = [
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-2-9b-it:free',
  'deepseek/deepseek-r1:free',
  'meta-llama/llama-3.2-3b-instruct:free',
];

function getProviderName() {
  if (process.env.AI_PROVIDER) {
    return process.env.AI_PROVIDER.toLowerCase();
  }

  return process.env.AI_API_KEY ? 'openrouter' : 'openai';
}

function getDefaultBaseUrl(provider) {
  if (provider === 'openrouter') {
    return 'https://openrouter.ai/api/v1';
  }

  if (provider === 'groq') {
    return 'https://api.groq.com/openai/v1';
  }

  return undefined;
}

function getDefaultModel(provider) {
  if (provider === 'openrouter') {
    return OPENROUTER_FALLBACK_MODELS[0];
  }

  if (provider === 'groq') {
    return 'llama-3.1-8b-instant';
  }

  return 'gpt-4o-mini';
}

export function getAIModelCandidates(provider, preferredModel) {
  if (provider !== 'openrouter') {
    return [preferredModel || getDefaultModel(provider)];
  }

  const models = [];
  const addModel = (model) => {
    if (!model) return;
    if (!models.includes(model)) {
      models.push(model);
    }
  };

  addModel(preferredModel);
  OPENROUTER_FALLBACK_MODELS.forEach(addModel);

  return models;
}

export function getAIConfig() {
  const provider = getProviderName();
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('AI_API_KEY (or OPENAI_API_KEY) is missing.');
  }

  const baseURL = process.env.AI_BASE_URL || getDefaultBaseUrl(provider);
  const model = process.env.AI_MODEL || getDefaultModel(provider);
  const modelCandidates = getAIModelCandidates(provider, model);

  const defaultHeaders = {};
  if (provider === 'openrouter') {
    if (process.env.APP_URL) {
      defaultHeaders['HTTP-Referer'] = process.env.APP_URL;
    }
    defaultHeaders['X-Title'] = process.env.APP_NAME || 'Vedas Vision';
  }

  return {
    provider,
    apiKey,
    baseURL,
    model,
    modelCandidates,
    defaultHeaders,
  };
}

export function getAIClient() {
  const { apiKey, baseURL, defaultHeaders } = getAIConfig();

  return new OpenAI({
    apiKey,
    baseURL,
    defaultHeaders,
  });
}
