import { generateText } from 'ai';
import { getModel } from '@/lib/models';
import type { ProviderKey } from '@/lib/models';

// ─── Resilience primitives ─────────────────────────────────────────────────

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError ?? new Error('retryWithBackoff: all attempts exhausted');
}

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(private maxTokens: number, private refillRateMs: number) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens <= 0) {
      const wait = this.refillRateMs - (Date.now() - this.lastRefill);
      await new Promise((r) => setTimeout(r, Math.max(wait, 0)));
      this.refill();
    }
    this.tokens--;
  }

  private refill(): void {
    const elapsed = Date.now() - this.lastRefill;
    const add = Math.floor(elapsed / this.refillRateMs);
    this.tokens = Math.min(this.maxTokens, this.tokens + add);
    this.lastRefill = Date.now();
  }
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(private failureThreshold: number, private recoveryTimeoutMs: number) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > this.recoveryTimeoutMs) {
        this.state = 'half-open';
      } else {
        throw new Error('CircuitBreaker: circuit is open — request rejected');
      }
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();
    if (this.failures >= this.failureThreshold) this.state = 'open';
  }

  get currentState() {
    return this.state;
  }
}

// ─── Shared instances (default limits — tune per deployment) ───────────────
const limiter = new RateLimiter(10, 1000);      // 10 req/s
const breaker = new CircuitBreaker(5, 30_000);  // open after 5 failures, recover after 30s

async function safeGenerate(prompt: string, provider?: ProviderKey): Promise<string> {
  await limiter.acquire();
  return breaker.execute(() =>
    retryWithBackoff(async () => {
      const { text } = await generateText({ model: getModel(provider), prompt });
      return text;
    })
  );
}

// ─── Workflow primitives ───────────────────────────────────────────────────

export async function createWorkflow(
  steps: string[],
  provider?: ProviderKey
): Promise<{ workflow: string[]; results: { step: string; result: string }[]; completed: boolean; timestamp: string }> {
  const results: { step: string; result: string }[] = [];
  for (const step of steps) {
    const result = await safeGenerate(step, provider);
    results.push({ step, result });
  }
  return { workflow: steps, results, completed: true, timestamp: new Date().toISOString() };
}

export async function executeParallel(
  prompts: string[],
  provider?: ProviderKey
): Promise<{ prompt: string; result: string }[]> {
  return Promise.all(
    prompts.map(async (prompt) => ({ prompt, result: await safeGenerate(prompt, provider) }))
  );
}

export async function executeSequential(
  prompts: string[],
  provider?: ProviderKey
): Promise<{ prompt: string; result: string }[]> {
  const results: { prompt: string; result: string }[] = [];
  for (const prompt of prompts) {
    results.push({ prompt, result: await safeGenerate(prompt, provider) });
  }
  return results;
}

export async function executeConditional(
  condition: string,
  truePrompt: string,
  falsePrompt: string,
  provider?: ProviderKey
): Promise<{ condition: string; isTrue: boolean; selectedPrompt: string; result: string }> {
  const conditionResult = await safeGenerate(
    `Evaluate this condition and respond with only "true" or "false": ${condition}`,
    provider
  );
  const isTrue = conditionResult.trim().toLowerCase().startsWith('true');
  const selectedPrompt = isTrue ? truePrompt : falsePrompt;
  const result = await safeGenerate(selectedPrompt, provider);
  return { condition, isTrue, selectedPrompt, result };
}
