import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Vercel AI Workflow
export async function createWorkflow(steps: string[]) {
  try {
    const results: any[] = [];

    for (const step of steps) {
      const result = await generateText({
        model: openai('gpt-4-turbo-preview'),
        prompt: step,
      });
      results.push({ step, result: result.text });
    }

    return {
      workflow: steps,
      results,
      completed: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Create workflow error: ${error?.message || 'Unknown error'}`);
  }
}

// Parallel execution
export async function executeParallel(prompts: string[]) {
  try {
    const results = await Promise.all(
      prompts.map(async (prompt) => {
        const result = await generateText({
          model: openai('gpt-4-turbo-preview'),
          prompt,
        });
        return { prompt, result: result.text };
      })
    );

    return results;
  } catch (error: any) {
    throw new Error(`Execute parallel error: ${error?.message || 'Unknown error'}`);
  }
}

// Sequential execution
export async function executeSequential(prompts: string[]) {
  try {
    const results: any[] = [];

    for (const prompt of prompts) {
      const result = await generateText({
        model: openai('gpt-4-turbo-preview'),
        prompt,
      });
      results.push({ prompt, result: result.text });
    }

    return results;
  } catch (error: any) {
    throw new Error(`Execute sequential error: ${error?.message || 'Unknown error'}`);
  }
}

// Conditional execution
export async function executeConditional(
  condition: string,
  truePrompt: string,
  falsePrompt: string
) {
  try {
    const conditionResult = await generateText({
      model: openai('gpt-4-turbo-preview'),
      prompt: `Evaluate this condition and return true or false: ${condition}`,
    });

    const isTrue = conditionResult.text.toLowerCase().includes('true');
    const selectedPrompt = isTrue ? truePrompt : falsePrompt;

    const result = await generateText({
      model: openai('gpt-4-turbo-preview'),
      prompt: selectedPrompt,
    });

    return {
      condition,
      isTrue,
      selectedPrompt,
      result: result.text,
    };
  } catch (error: any) {
    throw new Error(`Execute conditional error: ${error?.message || 'Unknown error'}`);
  }
}

// Retry with backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

// Rate limiter
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(private maxTokens: number, private refillRate: number) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens <= 0) {
      const waitTime = this.refillRate - (Date.now() - this.lastRefill);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.refill();
    }
    this.tokens--;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillRate);
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

// Circuit breaker
export class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private failureThreshold: number,
    private recoveryTimeout: number
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > this.recoveryTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }
}
