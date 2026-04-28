import { useMemo, useState } from 'react';
import knowledgeBase from '../data/knowledge.json';

const starterMessage = {
  role: 'assistant',
  content: 'Query the knowledge base about payment operations topics: failures, refunds, chargebacks, routing, and retry strategy.',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function scoreMatch(text, item) {
  const normalized = text.toLowerCase();
  return item.keywords.reduce((score, keyword) => score + (normalized.includes(keyword) ? 1 : 0), 0);
}

export default function Assistant({ insights }) {
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState('Why are card payments failing at night?');

  const knowledgeIndex = useMemo(() => knowledgeBase.map((entry) => ({ ...entry, score: 0 })), []);

  const generateReply = (query) => {
    const ranked = knowledgeIndex
      .map((entry) => ({ ...entry, score: scoreMatch(query, entry) }))
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];

    if (!best || best.score === 0) {
      return {
        content: `I can assist with payment operations queries. Current dataset shows a ${Math.round(insights.metrics.failureRate * 100)}% failure rate. Consider reviewing ${insights.patterns[0].toLowerCase()} for context.`,
        source: 'knowledge base',
      };
    }

    return {
      content: `${best.answer} ${best.action} Current dataset context: ${insights.patterns[0]}`,
      source: best.topic,
    };
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = {
      role: 'user',
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const reply = generateReply(input.trim());
    const assistantMessage = {
      role: 'assistant',
      content: reply.content,
      source: reply.source,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="glass-card rounded-3xl p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Knowledge Resource</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Payments operations reference</h2>
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Knowledge base topics</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {knowledgeBase.map((topic) => (
              <div key={topic.topic} className="rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3">
                <p className="font-medium text-white">{topic.topic}</p>
                <p className="mt-1 text-slate-400">{topic.action}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          The knowledge base covers common payment operations topics. Queries are matched by keyword.
        </div>
      </div>

      <div className="glass-card flex min-h-[640px] flex-col rounded-3xl p-5">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Conversation</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Operations Support</h3>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
              Connected to knowledge base
          </div>
        </div>

        <div className="scrollbar-hide mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-violet-500 text-white' : 'border border-white/10 bg-slate-950/70 text-slate-200'}`}>
                <p>{message.content}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/60">
                  <span>{message.time}</span>
                  {message.source ? <span>• {message.source}</span> : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/70 p-3">
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query payment operations: failures, routing, chargebacks, refunds, retries..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Sample queries: retry timing, refund processing, failed transactions</p>
            <button onClick={sendMessage} className="rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}