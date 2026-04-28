import { useMemo, useState } from 'react';
import { evaluateFraudRisk } from '../utils/riskEngine';

const methods = ['UPI', 'Card', 'Netbanking'];

export default function FraudEngine() {
  const [amount, setAmount] = useState(8999);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [time, setTime] = useState('23:10');
  const [bank, setBank] = useState('HDFC Bank');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => evaluateFraudRisk({ amount: 8999, paymentMethod: 'Card', time: '23:10', bank: 'HDFC Bank' }));

  const input = useMemo(() => ({ amount: Number(amount), paymentMethod, time, bank }), [amount, paymentMethod, time, bank]);

  const runEvaluation = () => {
    setLoading(true);
    window.setTimeout(() => {
      setResult(evaluateFraudRisk(input));
      setLoading(false);
    }, 900);
  };

  const barColor = result.riskLevel === 'High' ? 'bg-rose-500' : result.riskLevel === 'Medium' ? 'bg-amber-400' : 'bg-emerald-500';

  return (
    <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <div className="glass-card rounded-3xl p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Risk Assessment</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Calculate transaction risk score</h2>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Amount</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400/40" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Payment Method</span>
            <select className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400/40" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {methods.map((method) => <option key={method}>{method}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Time</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400/40" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Bank</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400/40" value={bank} onChange={(e) => setBank(e.target.value)} />
          </label>
          <button onClick={runEvaluation} className="inline-flex w-full items-center justify-center rounded-2xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400">
            {loading ? 'Calculating...' : 'Calculate Risk Score'}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Risk Output</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Score and assessment</h2>
          </div>
          <div className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${result.riskLevel === 'High' ? 'border-rose-400/30 bg-rose-500/10 text-rose-100' : result.riskLevel === 'Medium' ? 'border-amber-400/30 bg-amber-500/10 text-amber-100' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'}`}>
            {result.riskLevel} Risk
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Risk Score</p>
              <div className="mt-2 text-5xl font-semibold text-white">{result.score}</div>
            </div>
            <div className="text-right text-sm text-slate-400">
              <p>Model confidence</p>
              <p className="mt-2 text-2xl font-semibold text-violet-200">{result.confidence}%</p>
            </div>
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${result.score}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.28em] text-slate-500">Risk meter</p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Scoring factors</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {result.reasons.map((reason) => (
                <li key={reason} className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2">{reason}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-violet-950/40 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Recommended action</h3>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              {result.riskLevel === 'High'
                ? 'Recommend step-up authentication, velocity check, and manual review.'
                : result.riskLevel === 'Medium'
                  ? 'Allow with enhanced monitoring. Prepare fallback payment method.'
                  : 'Allow with standard monitoring.'}
            </p>
            <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100">
              {loading ? 'Processing...' : 'Risk score based on transaction attributes and historical patterns.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}