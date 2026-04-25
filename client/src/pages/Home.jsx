import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
import { getUserStats, getTodayChallenge, completeChallenge, getBadges } from '../services/api.js';
import BadgeDisplay from '../components/BadgeDisplay.jsx';

function Home() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const authRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalOpen = searchParams.get('modal') === '1';
  const [authMode, setAuthMode] = useState('signIn');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Gamification state
  const [stats, setStats] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [badges, setBadges] = useState([]);
  const [displayXp, setDisplayXp] = useState(0);
  const [completingChallenge, setCompletingChallenge] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const requestedMode = searchParams.get('auth');
    if (requestedMode === 'signin') {
      setAuthMode('signIn');
    } else if (requestedMode === 'signup') {
      setAuthMode('signUp');
    }
  }, [searchParams]);

  useEffect(() => {
    if (window.location.hash === '#auth' && authRef.current) {
      authRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchParams]);

  // Fetch gamification data when user is signed in
  useEffect(() => {
    if (!user) {
      setStatsLoading(false);
      return;
    }

    const fetchGamificationData = async () => {
      try {
        setStatsLoading(true);
        const [statsData, challengeData, badgesData] = await Promise.all([
          getUserStats(user.uid),
          getTodayChallenge(user.uid),
          getBadges(user.uid),
        ]);

        setStats(statsData);
        setChallenge(challengeData);
        setBadges(badgesData.badges || []);
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchGamificationData();
  }, [user]);

  // Animate XP counter
  useEffect(() => {
    if (!stats) return;

    let frame;
    let current = 0;
    const target = stats.xp;
    const step = Math.max(5, Math.floor(target / 60));
    const tick = () => {
      current += step;
      if (current >= target) {
        setDisplayXp(target);
        return;
      }
      setDisplayXp(current);
      frame = window.setTimeout(tick, 20);
    };
    tick();
    return () => window.clearTimeout(frame);
  }, [stats?.xp]);

  useEffect(() => {
    if (!user) return;
    setToasts((prev) => {
      if (prev.some((item) => item.id === 'welcome-badge')) {
        return prev;
      }
      return [...prev, { id: 'welcome-badge', text: '✨ Welcome back, Healer!' }];
    });
  }, [user]);

  const handleCompleteChallenge = async () => {
    if (!user || completingChallenge || challenge?.completedToday) return;

    setCompletingChallenge(true);
    try {
      const result = await completeChallenge(user.uid);
      setStats((prev) => ({
        ...prev,
        xp: result.totalXp,
        level: result.level,
        streak: result.streak,
      }));
      setChallenge((prev) => ({
        ...prev,
        completedToday: true,
        currentStreak: result.streak,
      }));

      setToasts((prev) => [
        ...prev,
        {
          id: `challenge-${Date.now()}`,
          text: `✅ Daily challenge completed! +${result.xp} XP 🔥`,
        },
      ]);

      // Check for new badges
      if (result.newBadges?.length > 0) {
        result.newBadges.forEach((badge) => {
          setToasts((prev) => [
            ...prev,
            {
              id: `badge-${badge.id}`,
              text: `🎉 New badge earned: ${badge.emoji} ${badge.name}`,
            },
          ]);
        });
        // Refresh badges
        const badgesData = await getBadges(user.uid);
        setBadges(badgesData.badges || []);
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      setToasts((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: '❌ Failed to complete challenge. Try again.',
        },
      ]);
    } finally {
      setCompletingChallenge(false);
    }
  };

  useEffect(() => {
    if (!toasts.length) return;
    const timeout = window.setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2800);
    return () => window.clearTimeout(timeout);
  }, [toasts]);

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(error?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'signIn') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (error) {
      setAuthError(error?.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const closeAuthModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('modal');
    setSearchParams(next);
  };

  if (loading) return <div className="p-10 text-center text-charcoal/60">Loading...</div>;

  // ── Logged-in home ──
  if (user) return (
    <div className="relative mx-auto max-w-6xl px-4 py-10">
      <div className="leaf-float pointer-events-none absolute left-2 top-20 text-xl opacity-20">🌿</div>
      <div className="leaf-float-delayed pointer-events-none absolute right-4 top-56 text-xl opacity-20">🍃</div>

      {statsLoading ? (
        <div className="py-20 text-center">
          <p className="text-slate-600">Loading your wellness profile...</p>
        </div>
      ) : (
        <>
          {/* Welcome hero */}
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-marigold/40 bg-gradient-to-br from-herbal via-neem to-sage p-7 text-white shadow-2xl">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-marigold/20 blur-3xl" />
            <div className="absolute -bottom-12 left-16 h-48 w-48 rounded-full bg-turmeric/15 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-widest text-marigold">Welcome back</p>
              <h1 className="mt-2 text-3xl font-bold">
                {profile?.name || user.displayName || user.email?.split('@')[0] || 'Healer'} 🙏
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-ivory/85">
                Level {stats?.level || 1} • {stats?.testCount || 0} assessments completed • Dominant Dosha: {stats?.dominantDosha ? stats.dominantDosha.charAt(0).toUpperCase() + stats.dominantDosha.slice(1) : 'Unknown'}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/chat" className="rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
                  Start Assessment →
                </Link>
                <Link to="/dashboard" className="rounded-2xl bg-turmeric/80 px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-turmeric">
                  View Dashboard
                </Link>
                <Link to="/history" className="rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10">
                  History
                </Link>
              </div>
            </div>
          </div>

          {/* Stats + progress */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-herbal/20 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-neem">Tests Taken</p>
              <p className="mt-1 text-3xl font-bold text-herbal">{stats?.testCount || 0}</p>
              <p className="mt-1 text-xs text-slate-500">Prakriti assessments</p>
            </div>
            <div className="rounded-2xl border border-turmeric/30 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-neem">Total XP</p>
              <p className="mt-1 text-3xl font-bold text-turmeric">{displayXp.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-500">Level {stats?.level || 1}</p>
            </div>
            <div className="rounded-2xl border border-neem/20 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-neem">Streak</p>
              <p className="mt-1 text-3xl font-bold text-neem">🔥 {challenge?.currentStreak || 0}</p>
              <p className="mt-1 text-xs text-slate-500">days active</p>
            </div>
            <div className="rounded-2xl border border-herbal/30 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-neem">Badges</p>
              <p className="mt-1 text-3xl font-bold text-herbal">{badges.filter((b) => b.earned).length}</p>
              <p className="mt-1 text-xs text-slate-500">of {badges.length} unlocked</p>
            </div>
          </div>

          {/* Daily Challenge */}
          {challenge && (
            <div className="mb-6 rounded-3xl border border-marigold/40 bg-gradient-to-br from-turmeric/10 to-marigold/10 p-6 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-herbal flex items-center gap-2">
                    📅 Today's Challenge
                    {challenge.completedToday && <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Complete</span>}
                  </h2>
                  <p className="mt-2 text-lg font-semibold text-charcoal">{challenge.challenge?.title}</p>
                  <p className="mt-1 text-sm text-slate-700">{challenge.challenge?.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-turmeric">+{challenge.challenge?.xp || 0}</p>
                  <p className="text-xs text-slate-600">XP</p>
                </div>
              </div>
              {!challenge.completedToday && (
                <button
                  onClick={handleCompleteChallenge}
                  disabled={completingChallenge}
                  className="mt-4 rounded-2xl bg-gradient-to-r from-turmeric to-marigold px-6 py-3 font-semibold text-charcoal transition disabled:opacity-50 hover:brightness-105"
                >
                  {completingChallenge ? 'Completing...' : '✅ Mark as Complete'}
                </button>
              )}
            </div>
          )}

          {/* Badges Section */}
          {badges.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-4 text-2xl font-bold text-herbal">🏆 Achievements & Badges</h2>
              <BadgeDisplay badges={badges} />
            </div>
          )}

          {/* Dosha cards */}
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-bold text-herbal">🌍 Your Dosha Constitution</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['🌬️', 'Vata', 'Movement & creativity', 'Warm foods, grounding routines, consistent sleep.'],
                ['🔥', 'Pitta', 'Digestion & intensity', 'Cooling foods, moderation, protect sleep.'],
                ['🌱', 'Kapha', 'Stability & endurance', 'Light meals, vigorous movement, stimulation.'],
              ].map(([icon, name, sub, tip]) => (
                <div
                  key={name}
                  className={`rounded-2xl border p-5 shadow-sm transition ${
                    stats?.dominantDosha?.toLowerCase() === name.toLowerCase()
                      ? 'border-marigold/60 bg-marigold/10'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-2xl">{icon}</p>
                  <p className="mt-2 font-semibold text-herbal">{name}</p>
                  <p className="text-xs text-neem">{sub}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{tip}</p>
                  {stats?.dominantDosha?.toLowerCase() === name.toLowerCase() && (
                    <p className="mt-2 text-xs font-semibold text-marigold">✓ Your dominant dosha</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="pointer-events-none fixed right-5 top-20 z-50 space-y-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-slide rounded-2xl border border-marigold/40 bg-white px-4 py-3 text-sm text-herbal shadow-lg">
            {toast.text}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative mx-auto w-full max-w-[1380px] px-3 py-8 sm:px-5 sm:py-10 lg:px-6 lg:py-12">
      <div className="leaf-float pointer-events-none absolute left-2 top-24 text-2xl opacity-30">🌿</div>
      <div className="leaf-float-delayed pointer-events-none absolute right-6 top-64 text-2xl opacity-35">🍃</div>

      <header className="relative mb-8 overflow-hidden rounded-3xl border border-marigold/60 bg-gradient-to-br from-herbal via-neem to-sage p-5 text-white shadow-2xl sm:mb-10 sm:p-7 lg:p-8">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-marigold/30 blur-2xl" />
        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-turmeric/20 blur-2xl" />
        <p className="text-xs uppercase tracking-[0.3em] text-marigold sm:text-sm">Veda’s Vision</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Ayurveda + AI in a realistic wellness journey</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-ivory/95 sm:text-[15px] sm:leading-8">Experience a guided, game-like Prakriti quest with tailored diet plans, daily routines, exercise suggestions, and preventive health advice inspired by traditional Ayurveda.</p>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className="rounded-full border border-white/20 bg-white/20 px-4 py-2 font-semibold backdrop-blur">Daily Wellness Streak: 0 days</span>
          <span className="rounded-full border border-white/20 bg-white/20 px-4 py-2 font-semibold backdrop-blur">XP: 0</span>
          <span className="rounded-full border border-white/20 bg-white/20 px-4 py-2 font-semibold backdrop-blur">Badge: 🔒 Locked</span>
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-herbal/20 bg-white/80 p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-neem">Assessments Completed</p>
          <p className="mt-1 text-xl font-semibold text-herbal">1,200+</p>
        </div>
        <div className="rounded-2xl border border-herbal/20 bg-white/80 p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-neem">Average User Rating</p>
          <p className="mt-1 text-xl font-semibold text-herbal">4.8 / 5</p>
        </div>
        <div className="rounded-2xl border border-herbal/20 bg-white/80 p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-neem">Personalized Plans</p>
          <p className="mt-1 text-xl font-semibold text-herbal">Daily Updated</p>
        </div>
      </section>

      <main className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <section className="space-y-6 rounded-3xl border border-marigold/30 bg-white p-5 shadow-2xl shadow-emerald-100/80 sm:p-8">
          <div className="rounded-3xl border border-herbal/20 bg-gradient-to-r from-herbal/10 to-turmeric/10 p-6">
            <h2 className="text-xl font-semibold text-herbal sm:text-2xl">Start your healing quest</h2>
            <p className="mt-3 text-sm leading-7 text-slate-800 sm:text-base">Chat with your Ayurveda guide instantly, or sign in to unlock the full assessment and save your progress like a wellness game profile.</p>
          </div>

          <div className="rounded-3xl border border-herbal/30 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-herbal sm:text-lg">Quest Progress</h3>
              <span className="rounded-full bg-turmeric/20 px-3 py-1 text-xs font-semibold text-charcoal">0% completed</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-herbal/10">
              <div className="h-full w-0 rounded-full bg-gradient-to-r from-herbal to-turmeric" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to start your Prakriti quest and track your wellness progress.</p>
            <Link
              to="/?auth=signup&modal=1"
              className="mt-4 inline-block rounded-2xl bg-gradient-to-r from-herbal to-neem px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
            >
              🌿 Take the Quest
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-base font-semibold text-herbal sm:text-lg">Dosha snapshots</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="hover-lift rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                <p className="text-xl">🌬️</p>
                <h4 className="mt-1 font-semibold text-herbal">Vata</h4>
                <p className="mt-1 text-sm leading-6 text-slate-700">Energy, movement, creativity. Get grounding routines and warm meals.</p>
              </div>
              <div className="hover-lift rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                <p className="text-xl">🔥</p>
                <h4 className="mt-1 font-semibold text-herbal">Pitta</h4>
                <p className="mt-1 text-sm leading-6 text-slate-700">Digestion and intensity. Receive cooling foods and balance practices.</p>
              </div>
              <div className="hover-lift rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                <p className="text-xl">🌱</p>
                <h4 className="mt-1 font-semibold text-herbal">Kapha</h4>
                <p className="mt-1 text-sm leading-6 text-slate-700">Stability and endurance. Unlock energizing movement and light meals.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-turmeric/40 bg-gradient-to-br from-ivory to-turmeric/10 p-5 text-slate-800 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-herbal sm:text-lg">Daily Challenge</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">Complete today's ritual: drink warm herbal water before breakfast and log your mood.</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-herbal shadow-sm">+80 XP</span>
            </div>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-herbal/10">
              <div className="h-full w-0 rounded-full bg-gradient-to-r from-herbal to-marigold" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">Sign in to track your daily challenges.</p>
              <Link
                to="/?auth=signup&modal=1"
                className="rounded-2xl bg-gradient-to-r from-turmeric to-marigold px-4 py-2 text-sm font-semibold text-charcoal transition hover:brightness-105"
              >
                Sign in to complete
              </Link>
            </div>
          </div>

        </section>

        <aside className="space-y-6 rounded-3xl border border-marigold/30 bg-white p-5 shadow-2xl shadow-emerald-100/80 sm:p-8">
          <div className="space-y-4 rounded-3xl bg-gradient-to-r from-herbal to-neem p-6 text-white">
            <h2 className="text-xl font-semibold sm:text-2xl">Your personalized Ayurveda guide</h2>
            <p className="text-sm leading-7 text-ivory sm:text-[15px]">Track your Prakriti score, ask the AI for wellness tips, and save your progress in one intelligent dashboard.</p>
          </div>

         

          <div className="rounded-3xl border border-neem/30 bg-white p-5 text-slate-800 sm:p-6">
            <h3 className="text-base font-semibold text-herbal sm:text-lg">Quick game guide</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">Start the AI chat, complete the questionnaire flow, and your report will be saved automatically for later review.</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs sm:gap-3">
              <div className="rounded-2xl bg-ivory p-3">
                <p className="font-semibold text-herbal">Step 1</p>
                <p className="mt-1">Chat</p>
              </div>
              <div className="rounded-2xl bg-ivory p-3">
                <p className="font-semibold text-herbal">Step 2</p>
                <p className="mt-1">Assess</p>
              </div>
              <div className="rounded-2xl bg-ivory p-3">
                <p className="font-semibold text-herbal">Step 3</p>
                <p className="mt-1">Unlock Plan</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-ivory to-sand p-5 text-slate-800 sm:p-6">
            <h3 className="text-base font-semibold text-herbal sm:text-lg">Why this feels real</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7">
              <li>• Ayurveda-based Prakriti scoring across body, digestion, sleep, and mental patterns.</li>
              <li>• AI-generated routines, meals, and preventive guidance tailored to your dominant dosha.</li>
              <li>• Gamified streaks, XP-like progress, and secure account history.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-marigold/30 bg-ivory p-5 text-sm leading-7 text-slate-800">
            <p className="font-semibold">Note:</p>
            <p className="mt-2">You can ask the chatbot about Ayurveda and Prakriti without logging in. Sign in only when you want to complete the assessment and save your report.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/chat" className="rounded-2xl bg-gradient-to-r from-herbal to-neem px-5 py-4 text-center text-base font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:px-6 sm:py-5">
              Open Chatbot
            </Link>
            <Link to="/dashboard" className="rounded-2xl border border-turmeric bg-gradient-to-r from-turmeric/20 to-marigold/20 px-5 py-4 text-center text-base font-semibold text-charcoal transition hover:-translate-y-1 sm:px-6 sm:py-5">
              View Dashboard
            </Link>
          </div>
        </aside>
      </main>

      <div className="pointer-events-none fixed right-5 top-20 z-50 space-y-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-slide rounded-2xl border border-marigold/40 bg-white px-4 py-3 text-sm text-herbal shadow-lg">
            {toast.text}
          </div>
        ))}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-marigold/40 bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neem">Veda's Vision</p>
                <h3 className="mt-1 text-2xl font-bold text-herbal">{authMode === 'signIn' ? 'Welcome back 🙏' : 'Create your account'}</h3>
                <p className="mt-1 text-sm text-slate-500">{authMode === 'signIn' ? 'Sign in to access your Prakriti report.' : 'Join to save your wellness journey.'}</p>
              </div>
              <button
                type="button"
                onClick={closeAuthModal}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-3">
              <button
                disabled={authLoading}
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-charcoal shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">or use email</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-charcoal">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-charcoal placeholder-slate-400 outline-none transition focus:border-herbal focus:ring-2 focus:ring-herbal/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-charcoal">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-charcoal placeholder-slate-400 outline-none transition focus:border-herbal focus:ring-2 focus:ring-herbal/20"
                    required
                  />
                </div>
                {authError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{authError}</div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-herbal to-neem py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {authLoading ? 'Please wait...' : authMode === 'signIn' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500">
                {authMode === 'signIn' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => { setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn'); setAuthError(''); }}
                  className="font-semibold text-herbal underline underline-offset-2 hover:text-neem"
                >
                  {authMode === 'signIn' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Home;
