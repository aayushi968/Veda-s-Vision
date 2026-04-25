import { getAIClient, getAIConfig } from '../utils/aiClient.js';

const CHAT_SYSTEM_PROMPT = `You are Veda, an Ayurveda wellness assistant for "Veda's Vision".

App flow:
Users answer 18 questions on body, digestion, sleep, energy, and mind. You assess Vata, Pitta, Kapha, find dominant Prakriti, and give a personalized report (diet, routine, exercise, precautions, health tendencies).

Rules:
- Use plain English. No Sanskrit unless asked.
- No medical diagnosis or guarantees.
- Do not repeat the question.
- Keep answers natural, clear, and concise.

Format:
- Website/how-it-works → 4–6 numbered steps.
- Diet/routine/exercise → 3–5 short bullet points.
- Simple questions → 1–3 sentences.
- Dosha/Prakriti → 3–5 sentence paragraph.

Style:
- Calm, practical, supportive.
- No headers, no labels, no fluff.
- Match answer length to question.

Goal:
Help users understand their body type and improve daily habits simply.`;
const CHAT_MAX_TOKENS = 300;
const CHAT_TIMEOUT_MS = 8000;
const CHAT_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_MODEL_ATTEMPTS = 2;
const responseCache = new Map();

function getCacheKey(inputPrompt) {
  return String(inputPrompt || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function getCachedResponse(cacheKey) {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    responseCache.delete(cacheKey);
    return null;
  }
  return cached.text;
}

function setCachedResponse(cacheKey, text) {
  if (!cacheKey || !text) return;
  responseCache.set(cacheKey, {
    text,
    expiresAt: Date.now() + CHAT_CACHE_TTL_MS,
  });
}

async function withTimeout(promise, timeoutMs) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI request timeout')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

function cleanResponse(text) {
  return String(text || '')
    .replace(/^quick answer[:\s]*/i, '')
    .replace(/^answer[:\s]*/i, '')
    .trim();
}

function isModelEndpointUnavailable(status, message) {
  const text = String(message || '').toLowerCase();
  return (
    String(status) === '404' ||
    text.includes('no endpoints found for') ||
    text.includes('model not found') ||
    text.includes('no provider available')
  );
}

export async function handleChat(req, res) {
  try {
    const { question, answer, prompt } = req.body;
    const inputPrompt =
      prompt ||
      `User answered ${question} as ${answer}. Provide a warm Ayurvedic response.`;
    const cacheKey = getCacheKey(inputPrompt);
    const cachedText = getCachedResponse(cacheKey);
    if (cachedText) {
      return res.json({ text: cachedText, source: 'cache' });
    }

    const aiClient = getAIClient();
    const { model, modelCandidates } = getAIConfig();
    const candidates = (modelCandidates || [model]).slice(0, MAX_MODEL_ATTEMPTS);

    let response;
    let lastError;
    for (const candidateModel of candidates) {
      try {
        response = await withTimeout(
          aiClient.chat.completions.create({
            model: candidateModel,
            messages: [
              {
                role: 'system',
                content: CHAT_SYSTEM_PROMPT,
              },
              {
                role: 'user',
                content: inputPrompt,
              },
            ],
            max_tokens: CHAT_MAX_TOKENS,
            temperature: 0.2,
          }),
          CHAT_TIMEOUT_MS,
        );
        break;
      } catch (error) {
        const status = error?.status || error?.code;
        const message = error?.message || '';
        lastError = error;

        if (message.toLowerCase().includes('timeout')) {
          console.warn(`AI timeout on model ${candidateModel}. Trying next candidate.`);
          continue;
        }

        if (isModelEndpointUnavailable(status, message)) {
          console.warn(`Model unavailable on provider: ${candidateModel}. Trying next candidate.`);
          continue;
        }

        throw error;
      }
    }

    if (!response && lastError) {
      throw lastError;
    }

    const rawText =
      response.choices?.[0]?.message?.content?.trim() ||
      'I am here to help. Please ask your Ayurveda question.';
    const text = cleanResponse(rawText);
    setCachedResponse(cacheKey, text);

    return res.json({ text });
  } catch (error) {
    const status = error?.status || error?.code || 500;
    const message = error?.message || 'AI chat request failed.';
    console.error('Chat error:', message);

    if (isModelEndpointUnavailable(status, message)) {
      return res.status(503).json({
        error:
          'The selected AI model is currently unavailable on the provider. Try another AI_MODEL or retry in a moment.',
        fallbackText:
          'Eat warm fresh meals, keep regular sleep, hydrate well, and follow a calm daily routine.',
      });
    }

    if (message.toLowerCase().includes('timeout')) {
      return res.status(504).json({
        error: 'The AI service took too long to respond. Please try a shorter question.',
        fallbackText:
          'Eat warm, light meals. Sleep and wake at regular times. Drink water and avoid late-night heavy food.',
      });
    }

    if (
      String(status) === '429' ||
      message.toLowerCase().includes('quota') ||
      message.toLowerCase().includes('rate limit')
    ) {
      return res.status(429).json({
        error: 'AI service quota exceeded for the current API key. Please use a free model or retry later.',
        fallbackText:
          'I am temporarily running in limited mode. General Ayurveda guidance: maintain regular meal timings, prefer warm freshly cooked food, hydrate through the day, and keep a consistent sleep schedule.',
      });
    }

    return res.status(500).json({ error: 'AI chat request failed. Please try again later.' });
  }
}
