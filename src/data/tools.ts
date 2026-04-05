export interface Tool {
  id: string;
  title: string;
  description: string;
  status: 'released' | 'beta' | 'in-development' | 'planned';
  github?: string;
  tags: string[];
}

export const tools: Tool[] = [
  // Tools will be added here as they are developed
  // Example:
  // {
  //   id: 'prompt-fuzzer',
  //   title: 'prompt-fuzzer',
  //   description: 'Automated prompt injection fuzzer for LLM APIs.',
  //   status: 'in-development',
  //   github: 'https://github.com/neurafault/prompt-fuzzer',
  //   tags: ['prompt-injection', 'fuzzing', 'llm'],
  // },
];
