function BadgeDisplay({ badges = [] }) {
  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-6">
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neem">Earned Badges ({earnedBadges.length})</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="rounded-xl border border-marigold/40 bg-gradient-to-br from-marigold/10 to-turmeric/10 p-4 text-center shadow-sm hover:shadow-md transition">
                <p className="text-3xl">{badge.emoji}</p>
                <p className="mt-1 text-xs font-semibold text-herbal">{badge.name}</p>
                <p className="mt-1 text-xs text-slate-600">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neem">Locked Badges ({lockedBadges.length})</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm opacity-60">
                <p className="text-3xl filter grayscale">{badge.emoji}</p>
                <p className="mt-1 text-xs font-semibold text-slate-600">{badge.name}</p>
                <p className="mt-1 text-xs text-slate-500">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeDisplay;
