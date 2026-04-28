import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FraudEngine from './components/FraudEngine';
import Optimizer from './components/Optimizer';
import Insights from './components/Insights';
import Assistant from './components/Assistant';
import transactions from './data/transactions.json';
import { buildInsights } from './utils/insightsEngine';

const tabs = {
  dashboard: Dashboard,
  fraud: FraudEngine,
  optimizer: Optimizer,
  insights: Insights,
  assistant: Assistant,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [booted, setBooted] = useState(false);

  const insights = useMemo(() => buildInsights(transactions), []);
  const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-mesh-gradient opacity-80" />
      <div className="pointer-events-none fixed inset-0 grid-sheen opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-[1800px] gap-5 p-4 lg:p-6">
        <div className="hidden w-[290px] shrink-0 xl:block">
          <div className="sticky top-6 h-[calc(100vh-3rem)]">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        <main className="flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 shadow-soft backdrop-blur-xl">
          <header className="border-b border-white/10 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">FinPilot – Payment Intelligence Platform</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Transaction Intelligence & Risk Operations
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Real-time payment analytics, fraud risk assessment, routing optimization, and decision support for payments teams.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  Engine Status: Operational
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
                  Last analysis: {timestamp}
                </div>
              </div>
            </div>
          </header>

          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-5 sm:p-7">
            {!booted ? (
              <div className="glass-card flex min-h-[520px] items-center justify-center rounded-[2rem] border border-white/10 text-center">
                <div>
                  <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-violet-500/20 ring-1 ring-violet-400/30" />
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Initializing analysis engine</p>
                  <p className="mt-3 text-slate-300">Computing risk models and transaction patterns.</p>
                </div>
              </div>
            ) : activeTab === 'dashboard' ? (
              <Dashboard metrics={insights.metrics} paymentMethodDistribution={insights.paymentMethodDistribution} trendData={insights.trendData} insights={insights} timestamp={timestamp} />
            ) : activeTab === 'fraud' ? (
              <FraudEngine />
            ) : activeTab === 'optimizer' ? (
              <Optimizer transactions={transactions} />
            ) : activeTab === 'insights' ? (
              <Insights insights={insights} />
            ) : (
              <Assistant insights={insights} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}