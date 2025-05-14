
'use server';
/**
 * @fileOverview Generates an image for the progress forest feature.
 *
 * - generateForestImage - A function that generates an image based on a textual description.
 * - GenerateForestImageInput - The input type for the generateForestImage function.
 * - GenerateForestImageOutput - The return type for the generateForestImage function (image data URI).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateForestImageInputSchema = z.object({
  prompt: z.string().describe('A textual description of the image to generate, typically 2-3 keywords.'),
});
export type GenerateForestImageInput = z.infer<typeof GenerateForestImageInputSchema>;

const GenerateForestImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateForestImageOutput = z.infer<typeof GenerateForestImageOutputSchema>;

export async function generateForestImage(input: GenerateForestImageInput): Promise<GenerateForestImageOutput> {
  return generateForestImageFlow(input);
}

const generateForestImageFlow = ai.defineFlow(
  {
    name: 'generateForestImageFlow',
    inputSchema: GenerateForestImageInputSchema,
    outputSchema: GenerateForestImageOutputSchema,
  },
  async (input) => {
    const imageGenPrompt = `A stylized digital art image for an eco-friendly app. Depict a scene of "${input.prompt}". The style should be vibrant, hopeful, and slightly cartoonish, suitable for a progress visualization. Focus on clear, appealing visuals like a children's book illustration.`;
    
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Use this model for image generation
        prompt: imageGenPrompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'], // MUST provide both IMAGE and TEXT
           safetySettings: [ // Relax safety settings for broader image generation
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        },
      });

      if (!media?.url) {
        console.error('Image generation call succeeded but returned no media URL.');
        throw new Error('Image generation failed to return a media URL.');
      }
      return { imageDataUri: media.url };

    } catch (error) {
      console.error(`Error in generateForestImageFlow for prompt "${input.prompt}":`, error);
      // Re-throw the error to be caught by the calling component
      throw error;
    }
  }
);
