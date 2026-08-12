// Analytics — wraps Vercel Analytics + Speed Insights.
// Both are zero-config on Vercel deployments; no props required.
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
