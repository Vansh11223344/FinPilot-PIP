import { BanknotesIcon, ChartBarIcon, ChatBubbleLeftRightIcon, ShieldExclamationIcon, SparklesIcon } from '@heroicons/react/24/outline';

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { id: 'fraud', label: 'Fraud Engine', icon: ShieldExclamationIcon },
  { id: 'optimizer', label: 'Optimizer', icon: BanknotesIcon },
  { id: 'insights', label: 'Insights', icon: SparklesIcon },
  { id: 'assistant', label: 'AI Assistant', icon: ChatBubbleLeftRightIcon },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="glass-card flex h-full flex-col border-white/10 bg-slate-950/70 p-4">
      <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/15 via-slate-900 to-cyan-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/40">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">FinPilot AI</p>
            <h1 className="text-lg font-semibold text-white">Payment Intelligence</h1>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Engine Status: Operational
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                selected
                  ? 'border-violet-400/40 bg-violet-500/15 text-white shadow-lg shadow-violet-950/30'
                  : 'border-white/5 bg-white/[0.03] text-slate-300 hover:border-violet-400/20 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${selected ? 'text-violet-300' : 'text-slate-400 group-hover:text-violet-200'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Engine Capabilities</p>
        <p className="mt-2 text-white">Risk modeling, transaction routing, and pattern analysis.</p>
        <p className="mt-3 text-xs text-slate-500">Built for fraud, ops, and payments teams.</p>
      </div>
    </aside>
  );
}