/**
 * Canonical model configuration — single source of truth for all AI providers.
 * Update model slugs here only; all routes and workflows import from this file.
 */
import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { anthropic } from '@ai-sdk/anthropic';
import { xai } from '@ai-sdk/xai';
import type { LanguageModelV1 } from 'ai';

export type ProviderKey = 'openai' | 'groq' | 'anthropic' | 'xai';

export const MODELS: Record<ProviderKey, LanguageModelV1> = {
  openai: openai('gpt-4o'),
  groq: groq('llama-3.3-70b-versatile'),
  anthropic: anthropic('claude-opus-4-5'),
  xai: xai('grok-3'),
};

export const DEFAULT_PROVIDER: ProviderKey = 'openai';

export function getModel(provider?: string): LanguageModelV1 {
  const key = (provider ?? DEFAULT_PROVIDER) as ProviderKey;
  return MODELS[key] ?? MODELS[DEFAULT_PROVIDER];
}
