import { useState } from 'react';
import { saveUserProfile } from '../services/api.js';

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function ProfileSetup({ uid, onComplete }) {
  const [form, setForm] = useState({ name: '', age: '', gender: '', contact: '', service: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.age || !form.gender || !form.contact.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isNaN(form.age) || Number(form.age) < 1 || Number(form.age) > 120) {
      setError('Please enter a valid age.');
      return;
    }
    setLoading(true);
    try {
      await saveUserProfile(uid, { ...form, age: Number(form.age) });
      onComplete({ ...form, age: Number(form.age) });
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-charcoal placeholder-slate-400 outline-none transition focus:border-herbal focus:ring-2 focus:ring-herbal/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-marigold/40 bg-white p-7 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neem">Veda's Vision</p>
        <h3 className="mt-1 text-2xl font-bold text-herbal">Complete your profile 🌿</h3>
        <p className="mt-1 text-sm text-slate-500">Tell us a little about yourself to personalise your experience.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-charcoal">Full Name <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className={inputClass} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-charcoal">Age <span className="text-red-400">*</span></label>
              <input type="number" value={form.age} onChange={set('age')} placeholder="e.g. 25" min="1" max="120" className={inputClass} required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-charcoal">Gender <span className="text-red-400">*</span></label>
              <select value={form.gender} onChange={set('gender')} className={inputClass} required>
                <option value="">Select</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-charcoal">Contact (Phone or Email) <span className="text-red-400">*</span></label>
            <input type="text" value={form.contact} onChange={set('contact')} placeholder="Phone number or alternate email" className={inputClass} required />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-charcoal">
              Service / Occupation <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input type="text" value={form.service} onChange={set('service')} placeholder="e.g. Student, Software Engineer, Doctor..." className={inputClass} />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-herbal to-neem py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Continue →'}
          </button>
        </form>
      </div>
    </div>
  );
}
