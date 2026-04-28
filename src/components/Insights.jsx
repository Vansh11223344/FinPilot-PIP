import { useEffect, useState } from 'react';

export default function Insights({ insights }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Analytics Engine</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Dataset analysis and observations</h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {loading ? 'Computing...' : 'Analysis complete'}
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insights.cards.map((card) => (
          <article key={card.id} className="glass-card card-hover rounded-3xl border border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-200">{card.tag}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Patterns</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Key observations</h3>
          <div className="mt-4 space-y-3">
            {insights.patterns.map((pattern) => (
              <div key={pattern} className="rounded-2xl border border-emerald-400/10 bg-emerald-500/8 px-4 py-3 text-sm leading-6 text-emerald-50">
                {pattern}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Anomalies</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Highlighted exceptions</h3>
          <div className="mt-4 min-h-[250px] space-y-3">
            {insights.anomalies.length ? insights.anomalies.map((anomaly) => (
              <div key={anomaly} className="rounded-2xl border border-rose-400/15 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
                {anomaly}
              </div>
            )) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] text-center text-sm text-slate-400">
                No exceptions detected. Patterns within expected ranges.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="glass-card rounded-3xl p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Interpretation</p>
        <h3 className="mt-1 text-xl font-semibold text-white">Summary and context</h3>
        <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm leading-7 text-slate-300">
          This analysis reflects patterns in the transaction dataset. All observations are deterministic, grounded in historical data, and available for analyst review and interpretation.
        </div>
      </div>
    </div>
  );
}