import { useMemo, useState } from 'react';
import { buildPaymentOptimization } from '../utils/optimizer';

export default function Optimizer({ transactions }) {
  const [amount, setAmount] = useState(1299);
  const [bank, setBank] = useState('HDFC Bank');
  const [time, setTime] = useState('20:40');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => buildPaymentOptimization(transactions, { amount: 1299, bank: 'HDFC Bank', time: '20:40' }));

  const input = useMemo(() => ({ amount: Number(amount), bank, time }), [amount, bank, time]);

  const runOptimization = () => {
    setLoading(true);
    window.setTimeout(() => {
      setResult(buildPaymentOptimization(transactions, input));
      setLoading(false);
    }, 900);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-card rounded-3xl p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Route Optimization</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Recommended payment rail and retry parameters</h2>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Amount</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400/40" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Bank</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400/40" value={bank} onChange={(e) => setBank(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Time</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400/40" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <button onClick={runOptimization} className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            {loading ? 'Computing...' : 'Generate Recommendation'}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Output</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Payment routing decision</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">Best payment method</p>
            <div className="mt-3 text-4xl font-semibold text-white">{result.recommendation}</div>
            <p className="mt-3 text-sm text-slate-300">Alternative rail: {result.alternative}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">Confidence score</p>
            <div className="mt-3 text-4xl font-semibold text-violet-200">{result.confidence}%</div>
            <div className="mt-4 h-3 rounded-full bg-slate-800">
              <div className="h-3 rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${result.confidence}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Retry timing recommendation: {result.retryTiming}
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Decision rationale</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            {result.explanation.map((line) => (
              <p key={line} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">{line}</p>
            ))}
          </div>
            <p className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100">
              {loading ? 'Processing...' : 'Decision based on success rates, bank performance, and transaction attributes.'}
            </p>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Ranked probability map</h3>
          <div className="mt-4 space-y-3">
            {result.probabilities.map((item) => (
              <div key={item.method} className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{item.method}</span>
                  <span>{Math.round(item.probability * 100)}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div className={`h-2 rounded-full ${item.method === result.recommendation ? 'bg-cyan-400' : 'bg-slate-500'}`} style={{ width: `${item.probability * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}