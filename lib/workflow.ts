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
