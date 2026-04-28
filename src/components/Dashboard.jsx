import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-400/30 bg-slate-900/95 p-3 backdrop-blur">
        <p className="text-sm font-semibold text-white">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-400/30 bg-slate-900/95 p-3 backdrop-blur">
        <p className="text-sm font-semibold text-white">{payload[0].name}</p>
        <p className="text-sm text-slate-100">Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const metricTone = {
  safe: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/20 text-emerald-100',
  warning: 'from-amber-500/20 to-amber-500/5 border-amber-400/20 text-amber-100',
  risk: 'from-rose-500/20 to-rose-500/5 border-rose-400/20 text-rose-100',
  accent: 'from-violet-500/20 to-violet-500/5 border-violet-400/20 text-violet-100',
};

export default function Dashboard({ metrics, paymentMethodDistribution, trendData, insights, timestamp }) {
  const cards = [
    { label: 'Total Transactions', value: metrics.total, helper: 'Sample volume', tone: 'accent' },
    { label: 'Success Rate', value: `${(metrics.successRate * 100).toFixed(1)}%`, helper: 'Completion rate', tone: 'safe' },
    { label: 'Failure Rate', value: `${(metrics.failureRate * 100).toFixed(1)}%`, helper: 'Decline rate', tone: 'warning' },
    { label: 'High-Risk Transactions', value: metrics.highRiskCount, helper: 'Risk threshold breaches', tone: 'risk' },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`glass-card card-hover rounded-3xl border bg-gradient-to-br ${metricTone[card.tone]} p-5`}>
            <p className="text-sm text-slate-300">{card.label}</p>
            <div className="mt-4 text-3xl font-semibold text-white">{card.value}</div>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-400">{card.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-3xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Hourly Performance</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Completion and decline trends</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Analysis timestamp: {timestamp}
            </div>
          </div>
          <div className="mt-6 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 12 }} interval={2} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="success" name="Success" stroke="#34d399" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="failure" name="Failure" stroke="#fb7185" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Payment Methods</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Rail volume breakdown</h2>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodDistribution} dataKey="value" innerRadius={72} outerRadius={104} paddingAngle={4}>
                  {paymentMethodDistribution.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={['#8b5cf6', '#34d399', '#60a5fa'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
            <InformationCircleIcon className="h-5 w-5 flex-none" />
            UPI leads transaction volume. Card payments dominate high-value segments.
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Key Observations</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Transaction patterns</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {insights.cards.map((card) => (
              <article key={card.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-violet-200">{card.tag}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{card.body}</p>
                <span className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs ${card.tone === 'safe' ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100' : card.tone === 'warning' ? 'border-amber-400/20 bg-amber-500/10 text-amber-100' : card.tone === 'risk' ? 'border-rose-400/20 bg-rose-500/10 text-rose-100' : 'border-violet-400/20 bg-violet-500/10 text-violet-100'}`}>
                  {card.tone.toUpperCase()} SIGNAL
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Operational snapshot</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Business context</h2>
          <div className="mt-5 space-y-3">
            {[
              ['Dataset Profile', 'Mixed transaction set with low and high-ticket volumes.'],
              ['Risk Signals', 'Elevated risk during off-peak hours and for high-value card transactions.'],
              ['Routing Strategy', 'UPI preferred for sub-₹5000 transactions.'],
              ['Model Basis', 'Rule-based scoring with historical transaction data.'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            Dashboard is designed for fraud analysts, payments ops, and risk review teams.
          </div>
        </div>
      </section>
    </div>
  );
}