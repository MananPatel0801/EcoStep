'use server';

/**
 * @fileOverview This file contains the PersonalizedEcoTips flow, which provides users with personalized tips for greener living based on their logged activities.
 *
 * - personalizedEcoTips - A function that returns personalized eco-tips.
 * - PersonalizedEcoTipsInput - The input type for the personalizedEcoTips function.
 * - PersonalizedEcoTipsOutput - The return type for the personalizedEcoTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEcoTipsInputSchema = z.object({
  loggedActivities: z
    .array(z.string())
    .describe('An array of the user\'s logged eco-friendly activities.'),
});
export type PersonalizedEcoTipsInput = z.infer<
  typeof PersonalizedEcoTipsInputSchema
>;

const PersonalizedEcoTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe('An array of personalized tips for greener living.'),
});
export type PersonalizedEcoTipsOutput = z.infer<
  typeof PersonalizedEcoTipsOutputSchema
>;

export async function personalizedEcoTips(
  input: PersonalizedEcoTipsInput
): Promise<PersonalizedEcoTipsOutput> {
  return personalizedEcoTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEcoTipsPrompt',
  input: {schema: PersonalizedEcoTipsInputSchema},
  output: {schema: PersonalizedEcoTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized tips for greener living. Based on the user's logged activities, suggest new ways to reduce their environmental impact.

  Logged Activities:
  {{#each loggedActivities}}
  - {{{this}}}
  {{/each}}

  Provide 3 personalized tips based on these activities:
  `,
});

const personalizedEcoTipsFlow = ai.defineFlow(
  {
    name: 'personalizedEcoTipsFlow',
    inputSchema: PersonalizedEcoTipsInputSchema,
    outputSchema: PersonalizedEcoTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
