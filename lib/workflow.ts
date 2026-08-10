import { openai } from '@ai-sdk/openai';
import { generateText, workflow, sleep } from 'workflow';
import { z } from 'zod';

// Vercel Workflow — Long-running AI agents that survive function timeouts
// This is the cutting edge of AI agent orchestration

const researchWorkflow = workflow('research-agent', {
  inputSchema: z.object({
    topic: z.string(),
    depth: z.enum(['quick', 'deep', 'comprehensive']),
  }),
  outputSchema: z.object({
    summary: z.string(),
    sources: z.array(z.string()),
    insights: z.array(z.string()),
  }),
}, async (ctx, input) => {
  // Step 1: Initial research
  ctx.log('Starting research on: ' + input.topic);
  
  const { text: initialResearch } = await generateText({
    model: openai('gpt-5.6-luna'),
    prompt: `Research the following topic and provide an initial overview: ${input.topic}`,
  });

  // Yield progress update
  ctx.yield({ step: 'initial_research', progress: 25 });

  // Step 2: Deep dive (with suspension for long operations)
  if (input.depth !== 'quick') {
    // Workflow can suspend and resume — survives function timeouts
    await sleep('5s'); // Simulate long-running operation
    
    const { text: deepAnalysis } = await generateText({
      model: openai('gpt-5.6-luna'),
      prompt: `Provide a deep analysis of: ${input.topic}\n\nInitial research: ${initialResearch}`,
    });

    ctx.yield({ step: 'deep_analysis', progress: 50 });

    // Step 3: Source verification
    const { text: sources } = await generateText({
      model: openai('gpt-5.6-luna'),
      prompt: `List credible sources for this research: ${input.topic}`,
    });

    ctx.yield({ step: 'source_verification', progress: 75 });

    // Step 4: Final synthesis
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
});

// Export for API route
export { researchWorkflow };