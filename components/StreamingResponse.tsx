'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import type { ProviderKey } from '@/lib/models';

const PROVIDERS: ProviderKey[] = ['openai', 'groq', 'anthropic', 'xai'];

export function StreamingResponse() {
  const [provider, setProvider] = useState<ProviderKey>('openai');

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: { provider },
  });

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      {/* Provider selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PROVIDERS.map((p) => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              provider === p
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-6 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center pt-8">
            Send a message to see streaming in action.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-xl px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">Error: {error.message}</p>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder={`Ask anything — routed to ${provider}…`}
          className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl px-6 py-3 text-sm font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
