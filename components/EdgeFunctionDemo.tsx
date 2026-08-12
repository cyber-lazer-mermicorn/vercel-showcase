'use client';

import { useState } from 'react';

interface Metric {
  metric: string;
  value: unknown;
}

const METRICS = ['requests', 'latency', 'region', 'timestamp'] as const;

export function EdgeFunctionDemo() {
  const [results, setResults] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchMetric(metric: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Get the ${metric} metric` }],
          provider: 'openai',
        }),
      });
      if (res.ok) {
        setResults((prev) => [
          { metric, value: `Fetched at ${new Date().toLocaleTimeString()}` },
          ...prev.slice(0, 4),
        ]);
      }
    } catch {
      setResults((prev) => [{ metric, value: 'Error fetching metric' }, ...prev.slice(0, 4)]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <p className="text-gray-400 text-sm mb-6">
        Edge Functions execute in the region closest to your user — cold starts under 50ms.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {METRICS.map((m) => (
          <button
            key={m}
            onClick={() => fetchMetric(m)}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-gray-200 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          >
            {m}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((r, i) => (
            <li key={i} className="flex justify-between text-sm bg-gray-700/50 rounded-lg px-4 py-2">
              <span className="text-purple-400 font-mono">{r.metric}</span>
              <span className="text-gray-300">{String(r.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
