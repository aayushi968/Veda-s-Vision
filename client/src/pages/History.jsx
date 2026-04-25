import { useEffect, useState } from 'react';
import { useAuth } from '../services/auth.jsx';
import { getAssessmentHistory } from '../services/api';

function History() {
  const { user, loading } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      getAssessmentHistory(user.uid)
        .then((response) => {
          setHistory(response.history || []);
        })
        .catch((err) => {
          setError(err?.response?.data?.error || 'Unable to load history.');
        });
    }
  }, [loading, user]);

  if (loading) {
    return <div className="p-10 text-center text-slate-600">Loading history...</div>;
  }

  if (!user) {
    return <div className="p-10 text-center text-red-600">Please sign in from the home page to view your assessment history.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1380px] px-3 py-8 sm:px-5 lg:px-6">
      <div className="mb-8 rounded-3xl border border-neem/30 bg-white p-5 shadow-xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-neem sm:text-sm">Saved assessments</p>
        <h1 className="text-2xl font-semibold text-herbal sm:text-3xl">History</h1>
      </div>

      {error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="rounded-3xl border border-neem/30 bg-white p-10 text-center text-slate-700 shadow-xl">
            <p>No saved Prakriti reports yet.</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="rounded-3xl border border-neem/30 bg-white p-6 shadow-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-neem">{new Date((item.createdAt?.seconds ?? item.createdAt?._seconds ?? Date.now() / 1000) * 1000).toLocaleDateString()}</p>
                  <h2 className="text-2xl font-semibold text-herbal">{item.dominantDosha?.toUpperCase()} dominant</h2>
                </div>
                <p className="rounded-full bg-ivory px-4 py-2 text-sm font-medium text-charcoal">Score V:{item.scores?.vata} P:{item.scores?.pitta} K:{item.scores?.kapha}</p>
              </div>
              <div className="mt-5 space-y-4 text-slate-700">
                <div>
                  <p className="font-semibold text-herbal">Summary</p>
                  <p className="mt-2 leading-7">{item.report?.summary || item.recommendations}</p>
                </div>
                <div>
                  <p className="font-semibold text-herbal">Answers</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {(item.answers || []).map((answer, idx) => (
                      <div key={`${item.id}-${idx}`} className="rounded-2xl border border-neem/20 bg-ivory p-4">
                        <p className="text-sm uppercase tracking-[0.2em] text-neem">{answer.question}</p>
                        <p className="mt-1 font-semibold text-charcoal">{answer.label || answer.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-herbal">Recommendations</p>
                  <p className="whitespace-pre-line leading-7">{item.recommendations}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
