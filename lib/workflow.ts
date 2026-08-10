import { openai } from '@ai-sdk/openai';
import { generateText, workflow, sleep } from 'workflow';
import { z } from 'zod';

const researchWorkflow = workflow('research-agent', {
  inputSchema: z.object({
    topic: z.string().min(1).max(1000),
    depth: z.enum(['quick', 'deep', 'comprehensive']),
  }),
  outputSchema: z.object({
    summary: z.string(),
    sources: z.array(z.string()),
    insights: z.array(z.string()),
  }),
}, async (ctx, input) => {
  try {
    ctx.log('Starting research on: ' + input.topic);

    const { text: initialResearch } = await generateText({
      model: openai('gpt-5.6-luna'),
      prompt: `Research the following topic and provide an initial overview: ${input.topic}`,
    });

    ctx.yield({ step: 'initial_research', progress: 25 });

    if (input.depth !== 'quick') {
      await sleep('5s');

      const { text: deepAnalysis } = await generateText({
        model: openai('gpt-5.6-luna'),
        prompt: `Provide a deep analysis of: ${input.topic}\n\nInitial research: ${initialResearch}`,
      });

      ctx.yield({ step: 'deep_analysis', progress: 50 });

      const { text: sources } = await generateText({
        model: openai('gpt-5.6-luna'),
        prompt: `List credible sources for this research: ${input.topic}`,
      });

      ctx.yield({ step: 'source_verification', progress: 75 });

      const { text: finalReport } = await generateText({
        model: openai('gpt-5.6-luna'),
        prompt: `Synthesize this research into a comprehensive report:\n\nTopic: ${input.topic}\n\nInitial: ${initialResearch}\n\nDeep Analysis: ${deepAnalysis}\n\nSources: ${sources}`,
      });

      ctx.yield({ step: 'synthesis', progress: 100 });

      return {
        summary: finalReport,
        sources: sources.split('\n').filter(s => s.startsWith('-')),
        insights: [initialResearch, deepAnalysis].map(s => s.substring(0, 200)),
      };
    }

    return {
      summary: initialResearch,
      sources: [],
      insights: [initialResearch.substring(0, 200)],
    };
  } catch (error) {
    ctx.log(`Workflow failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
});

export { researchWorkflow };