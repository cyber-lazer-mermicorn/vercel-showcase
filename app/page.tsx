import { StreamingResponse } from '@/components/StreamingResponse';
import { EdgeFunctionDemo } from '@/components/EdgeFunctionDemo';
import { ISRDemo } from '@/components/ISRDemo';
import { Analytics } from '@/components/Analytics';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Vercel AI Accelerator
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built by Cherry Barton to showcase advanced Vercel features:
            Edge Functions, AI SDK, ISR, and real-time capabilities.
          </p>
        </div>
      </section>

      {/* AI Chat Demo */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">AI Chat with Streaming</h2>
        <StreamingResponse />
      </section>

      {/* Edge Functions Demo */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Edge Functions</h2>
        <EdgeFunctionDemo />
      </section>

      {/* ISR Demo */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Incremental Static Regeneration</h2>
        <ISRDemo />
      </section>

      {/* Analytics */}
      <Analytics />
    </main>
  );
}