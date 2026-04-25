import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
import { questions } from '../data/questions';
import { sendAssessment, sendChatMessage } from '../services/api';
import ChatBubble from '../components/ChatBubble';

const initialScores = { vata: 0, pitta: 0, kapha: 0 };

function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('guide');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState(() =>
    questions.map((question) => ({ question: question.question, value: null, label: null })),
  );
  const [chat, setChat] = useState([
    {
      role: 'system',
      message: 'Welcome to Veda’s Vision. Ask me about Ayurveda, Prakriti, or the wellness guidance on this website. Choose Prakriti assessment if you want to discover your dominant dosha.',
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [guideLoading, setGuideLoading] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const chatScrollRef = useRef(null);
  const [guestInfo] = useState('You can chat with the Ayurveda guide without signing in. Sign in to unlock the full Prakriti assessment.');

  const currentQuestion = questions[currentIndex];
  const quickPrompts = [
    'What should I eat in the morning for a balanced dosha?',
    'How can I improve digestion using Ayurveda habits?',
    'Give me a simple daily routine for stress reduction.',
  ];

  const scores = useMemo(() => {
    const current = { ...initialScores };
    answers.forEach((answer) => {
      current[answer.value] += 1;
    });
    return current;
  }, [answers]);

  useEffect(() => {
    if (mode !== 'assessment') {
      return;
    }

    const savedAnswer = assessmentAnswers[currentIndex]?.value || null;
    setSelectedOption(savedAnswer);
  }, [assessmentAnswers, currentIndex, mode]);

  useEffect(() => {
    if (!chatScrollRef.current || mode !== 'guide') {
      return;
    }

    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chat, mode]);

  const askGuideQuestion = async (question) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || guideLoading) return;

    setPromptText('');
    setError(null);
    setGuideLoading(true);
    setChat((prev) => [...prev, { role: 'user', message: trimmedQuestion }]);

    const prompt = trimmedQuestion;

    try {
      const reply = await sendChatMessage({ prompt });
      setChat((prev) => [...prev, { role: 'assistant', message: reply.text }]);
    } catch (err) {
      const apiError = err?.response?.data?.error;
      const fallbackText = err?.response?.data?.fallbackText;
      setError(apiError || 'The guide is having trouble responding. Please try again.');
      setChat((prev) => [
        ...prev,
        { role: 'assistant', message: fallbackText || 'I am processing your question and will continue shortly.' },
      ]);
    } finally {
      setGuideLoading(false);
    }
  };

  const handleGuideSubmit = async (event) => {
    event.preventDefault();
    await askGuideQuestion(promptText);
  };

  const handleGuideKeyDown = async (event) => {
    // Enter submits; Shift+Enter allows multiline input.
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent?.isComposing) {
      return;
    }

    event.preventDefault();
    await askGuideQuestion(promptText);
  };

  const handleModeChange = (nextMode) => {
    setError(null);
    setSelectedOption(null);
    setMode(nextMode);
  };

  const restartAssessment = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setAssessmentAnswers(
      questions.map((question) => ({ question: question.question, value: null, label: null })),
    );
    setError(null);
    setSubmitting(false);
    setSelectedOption(null);
  };

  const retakeAssessment = () => {
    restartAssessment();
    setChat((prev) => [...prev, { role: 'assistant', message: 'Assessment reset. Let us begin again from Question 1.' }]);
  };

  const handleAnswer = (option) => {
    if (submitting) {
      return;
    }

    if (!user) {
      setError('Please sign in to start the Prakriti assessment.');
      return;
    }

    setError(null);
    setSelectedOption(option.value);
    setAssessmentAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        question: currentQuestion.question,
        value: option.value,
        label: option.label,
      };
      return updated;
    });
  };

  const handlePreviousQuestion = () => {
    if (submitting) {
      return;
    }

    setError(null);
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
    }
  };

  const handleNextQuestion = async () => {
    if (submitting) {
      return;
    }

    if (!user) {
      setError('Please sign in to start the Prakriti assessment.');
      return;
    }

    const selected = assessmentAnswers[currentIndex];
    if (!selected?.value) {
      setError('Please select an option before continuing.');
      return;
    }

    setError(null);

    setChat((prev) => [...prev, { role: 'user', message: selected.label }]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((index) => index + 1);
      setSelectedOption(assessmentAnswers[currentIndex + 1]?.value || null);
    } else {
      const completedAnswers = assessmentAnswers
        .filter((answerItem) => answerItem.value)
        .map((answerItem) => ({ question: answerItem.question, value: answerItem.value, label: answerItem.label }));
      setAnswers(completedAnswers);
      await submitAssessment(completedAnswers);
    }
  };

  const calculateScores = (answerList) => {
    const current = { ...initialScores };
    answerList.forEach((answer) => {
      current[answer.value] += 1;
    });
    return current;
  };

  const submitAssessment = async (answersPayload) => {
    setSubmitting(true);
    setError(null);
    setChat((prev) => [...prev, { role: 'assistant', message: 'Creating your report. Please wait while I generate your dashboard.' }]);
    const finalScores = calculateScores(answersPayload);
    const dominant = Object.keys(finalScores).reduce((a, b) => (finalScores[a] > finalScores[b] ? a : b));

    if (!user) {
      setError('Please sign in to save your Prakriti assessment and continue.');
      setSubmitting(false);
      return;
    }

    const result = { userId: user.uid, answers: answersPayload, scores: finalScores, dominantDosha: dominant };
    try {
      const response = await sendAssessment(result);
      navigate('/dashboard', { state: response });
    } catch (err) {
      const apiError = err?.response?.data?.error;
      setError(apiError || 'Unable to submit the assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1380px] flex-col px-3 py-8 sm:px-5 lg:px-6">
      <div className="mb-6 flex items-center justify-between rounded-3xl border border-neem/30 bg-white p-5 shadow-xl sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-neem sm:text-sm">Ayurveda Guide</p>
          <h1 className="text-2xl font-semibold text-herbal sm:text-3xl">Veda’s Vision Chat</h1>
          <p className="mt-2 text-sm leading-7 text-slate-700">{guestInfo}</p>
        </div>
      </div>

      {mode === 'guide' ? (
        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4 rounded-3xl border border-neem/30 bg-white p-5 shadow-xl sm:p-6">
            <div
              ref={chatScrollRef}
              className={`space-y-4 rounded-2xl border border-neem/20 bg-ivory/30 p-3 sm:p-4 ${chat.length > 1 ? 'max-h-[62vh] min-h-[50vh] overflow-y-auto' : ''}`}
            >
              {chat.map((item, index) => (
                <ChatBubble key={index} role={item.role} message={item.message} />
              ))}
            </div>
            {chat.length <= 1 ? (
              <div className="rounded-3xl border border-neem/20 bg-gradient-to-r from-herbal/5 to-neem/10 p-5">
                <h3 className="text-base font-semibold text-herbal">Quick Start</h3>
                <p className="mt-1 text-sm text-slate-700">Try one of these common Ayurveda questions:</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => askGuideQuestion(prompt)}
                      disabled={guideLoading}
                      className="cursor-pointer rounded-2xl border border-neem/30 bg-white px-4 py-3 text-left text-sm text-charcoal transition hover:bg-neem/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-neem/30 bg-gradient-to-b from-ivory to-sage/20 p-5 shadow-xl sm:p-6">
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => handleModeChange('guide')}
                className="rounded-full bg-herbal px-4 py-2 text-sm font-semibold text-white transition"
              >
                Ask about Ayurveda
              </button>
              <button
                onClick={() => handleModeChange('assessment')}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-herbal transition"
              >
                Prakriti assessment
              </button>
            </div>

            <div>
              <p className="text-sm leading-7 text-slate-700">Ask a question about Prakriti, Ayurveda, or how to use this website.</p>
              <form onSubmit={handleGuideSubmit} className="mt-6 space-y-4">
                <textarea
                  value={promptText}
                  onChange={(event) => setPromptText(event.target.value)}
                  onKeyDown={handleGuideKeyDown}
                  rows={5}
                  placeholder="Type your question here..."
                  className="w-full rounded-3xl border border-neem/30 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-herbal"
                />
                <button
                  type="submit"
                  disabled={guideLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-herbal to-neem px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  {guideLoading ? 'Sending...' : 'Send question'}
                </button>
              </form>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {submitting && <p className="mt-4 text-sm text-slate-600">Creating your report...</p>}
          </aside>
        </section>
      ) : (
        <section className="rounded-3xl border border-neem/30 bg-white p-5 shadow-xl sm:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleModeChange('guide')}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-herbal transition hover:bg-neem/10"
              >
                Ask about Ayurveda
              </button>
              <button
                onClick={() => handleModeChange('assessment')}
                className="rounded-full bg-herbal px-4 py-2 text-sm font-semibold text-white transition"
              >
                Prakriti assessment
              </button>
            </div>
            <span className="rounded-full border border-neem/30 bg-neem/10 px-4 py-2 text-sm font-semibold text-herbal">
              Question {Math.min(currentIndex + 1, questions.length)} / {questions.length}
            </span>
          </div>

          {!user ? (
            <div className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              <p className="text-base font-semibold">Sign in to take the Prakriti assessment.</p>
              <p>Guests can still chat about Ayurveda and the site. Assessment results are saved only after login.</p>
              <button
                onClick={() => navigate('/')}
                className="w-full rounded-2xl bg-gradient-to-r from-herbal to-neem px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
              >
                Return to sign in
              </button>
              <p className="text-sm text-slate-700">If you want to save your result, sign in with Google or email from the home page.</p>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="rounded-3xl border border-neem/20 bg-gradient-to-r from-herbal/5 to-neem/10 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-herbal">Prakriti Assessment</h2>
                    <p className="mt-3 text-base text-slate-700">{currentQuestion.question}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={restartAssessment}
                      className="rounded-2xl border border-neem/40 bg-white px-4 py-2 text-sm font-semibold text-herbal transition hover:bg-neem/10"
                    >
                      Restart
                    </button>
                    <button
                      type="button"
                      onClick={retakeAssessment}
                      className="rounded-2xl border border-turmeric/60 bg-gradient-to-r from-turmeric/15 to-marigold/20 px-4 py-2 text-sm font-semibold text-charcoal transition hover:brightness-105"
                    >
                      Retake Assessment
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option)}
                    disabled={submitting}
                    className={`w-full rounded-2xl border px-5 py-4 text-left transition ${selectedOption === option.value
                      ? 'border-herbal bg-herbal text-white shadow-md'
                      : 'border-neem/20 bg-white text-charcoal hover:bg-neem/10'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={submitting || currentIndex === 0}
                  className="rounded-2xl border border-neem/40 bg-white px-5 py-3 text-sm font-semibold text-herbal transition hover:bg-neem/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={submitting}
                  className="rounded-2xl bg-gradient-to-r from-herbal to-neem px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {currentIndex === questions.length - 1 ? 'Finish & Create Report' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
          {submitting && <p className="mt-6 text-sm text-slate-600">Saving your report...</p>}
        </section>
      )}
    </div>
  );
}

export default Chat;
