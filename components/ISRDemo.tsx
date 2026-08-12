// ISR Demo — rendered at build time, revalidates every 60 seconds.
// The timestamp shown is the last server render time, not the client request time.
import { unstable_noStore as noStore } from 'next/cache';

async function getData() {
  // Opt out of static caching for this fetch to demonstrate ISR revalidation.
  noStore();
  // In a real deployment replace this URL with a live data endpoint.
  return {
    timestamp: new Date().toISOString(),
    message: 'This content was server-rendered and will revalidate every 60 seconds.',
    revalidate: 60,
  };
}

export async function ISRDemo() {
  const data = await getData();

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <p className="text-gray-400 text-sm mb-4">
        ISR serves a static page instantly and regenerates it in the background on a schedule.
        The timestamp below updates every 60 seconds without a full redeploy.
      </p>
      <div className="bg-gray-700/50 rounded-xl px-6 py-4 font-mono text-sm">
        <p className="text-purple-400">Last rendered</p>
        <p className="text-white mt-1">{data.timestamp}</p>
        <p className="text-gray-500 mt-3 text-xs">Revalidates every {data.revalidate}s</p>
      </div>
    </div>
  );
}
