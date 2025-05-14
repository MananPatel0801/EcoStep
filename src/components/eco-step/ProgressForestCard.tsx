
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Trees } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { generateForestImage } from '@/ai/flows/generate-forest-image-flow';

interface ProgressForestCardProps {
  points: number;
}

interface ForestStage {
  minPoints: number;
  imageSrc: string; // Placeholder image
  altText: string;
  message: string;
  imageHint: string; // Hint for AI image generation
  imageSize: { width: number; height: number };
}

const forestStages: ForestStage[] = [
  { 
    minPoints: 0, 
    imageSrc: 'https://placehold.co/200x150.png', 
    altText: 'Barren ground with a small sprout', 
    message: 'Your eco-journey begins! Plant the first seed.',
    imageHint: 'barren ground tiny sprout',
    imageSize: { width: 200, height: 150 }
  },
  { 
    minPoints: 1, 
    imageSrc: 'https://placehold.co/200x180.png', 
    altText: 'A tiny seedling growing', 
    message: 'A seedling has sprouted! Keep up the good work.',
    imageHint: 'seedling plant growing',
    imageSize: { width: 200, height: 180 }
  },
  { 
    minPoints: 100, 
    imageSrc: 'https://placehold.co/250x200.png', 
    altText: 'A small tree with some flowers', 
    message: 'Your forest is growing with a small tree!',
    imageHint: 'small tree flowers',
    imageSize: { width: 250, height: 200 }
  },
  { 
    minPoints: 300, 
    imageSrc: 'https://placehold.co/300x250.png', 
    altText: 'A medium-sized tree with bushes', 
    message: 'A healthy tree stands tall in your forest!',
    imageHint: 'medium tree bushes',
    imageSize: { width: 300, height: 250 }
  },
  { 
    minPoints: 500, 
    imageSrc: 'https://placehold.co/350x280.png', 
    altText: 'A lush forest scene with multiple trees', 
    message: 'Your Progress Forest is flourishing! What a beautiful sight.',
    imageHint: 'lush forest multiple trees',
    imageSize: { width: 350, height: 280 }
  },
];

export function ProgressForestCard({ points }: ProgressForestCardProps) {
  const [currentGeneratedImage, setCurrentGeneratedImage] = useState<string | null>(null);
  const [isLoadingCurrentImage, setIsLoadingCurrentImage] = useState<boolean>(false);
  const [currentImageError, setCurrentImageError] = useState<string | null>(null);

  // Find the current stage by looking from highest minPoints downwards
  const currentStage = forestStages.slice().reverse().find(stage => points >= stage.minPoints) || forestStages[0];

  useEffect(() => {
    // This effect runs when the currentStage (identified by its imageHint or placeholder imageSrc) changes.
    // It attempts to fetch an AI-generated image for the current stage.

    const fetchImageForStage = async () => {
      if (!currentStage.imageHint) {
        // No hint available for this stage, use its placeholder directly.
        setCurrentGeneratedImage(currentStage.imageSrc);
        setIsLoadingCurrentImage(false);
        setCurrentImageError(null);
        return;
      }

      // Start loading state
      setIsLoadingCurrentImage(true);
      setCurrentImageError(null);
      setCurrentGeneratedImage(null); // Clear previous image

      try {
        // console.log(`Requesting image for hint: ${currentStage.imageHint}`);
        const result = await generateForestImage({ prompt: currentStage.imageHint });
        if (result.imageDataUri) {
          // console.log(`Image received for ${currentStage.imageHint}: ${result.imageDataUri.substring(0,60)}...`);
          setCurrentGeneratedImage(result.imageDataUri);
        } else {
          // console.warn(`Image generation for "${currentStage.imageHint}" returned no URI.`);
          setCurrentImageError("AI failed to paint a picture. Using default.");
          setCurrentGeneratedImage(currentStage.imageSrc); // Fallback to placeholder
        }
      } catch (error) {
        console.error(`Error generating image for hint "${currentStage.imageHint}":`, error);
        let errorMessage = "Error generating image. Using default image.";
        if (error instanceof Error) {
            if (error.message.includes('Service Unavailable') || error.message.includes('overloaded') || error.message.includes('503')) {
                errorMessage = "Our AI artist is currently resting. Using default image.";
            } else if (error.message.includes('candidate was blocked')) {
                 errorMessage = "AI couldn't generate this image due to safety reasons. Using default.";
            }
        }
        setCurrentImageError(errorMessage);
        setCurrentGeneratedImage(currentStage.imageSrc); // Fallback to placeholder
      } finally {
        setIsLoadingCurrentImage(false);
      }
    };

    fetchImageForStage();
    // Adding currentStage.imageHint and currentStage.imageSrc to dependencies to re-run when the stage fundamentally changes.
  }, [currentStage.imageHint, currentStage.imageSrc]);

  const displayImageSrc = currentGeneratedImage || currentStage.imageSrc;
  const isUsingPlaceholder = displayImageSrc === currentStage.imageSrc;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <Trees className="w-7 h-7 mr-2"/> Progress Forest
        </CardTitle>
        <CardDescription>Watch your positive impact grow visually.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center space-y-4">
        <div 
          className="relative transition-all duration-500 ease-in-out" 
          style={{width: currentStage.imageSize.width, height: currentStage.imageSize.height}}
        >
          {isLoadingCurrentImage ? (
            <Skeleton 
              className="w-full h-full rounded-lg" 
              style={{width: currentStage.imageSize.width, height: currentStage.imageSize.height}}
              aria-label="Loading forest image"
            />
          ) : (
            <Image 
              src={displayImageSrc} 
              alt={currentStage.altText} 
              width={currentStage.imageSize.width}
              height={currentStage.imageSize.height}
              // Only add data-ai-hint if we are actually displaying the placeholder
              data-ai-hint={isUsingPlaceholder && !currentGeneratedImage ? currentStage.imageHint : undefined}
              className="rounded-lg shadow-md object-cover"
              priority={true} // Prioritize loading the current forest image
              unoptimized={displayImageSrc.startsWith('data:image')} // Necessary for base64 images
            />
          )}
        </div>
        {currentImageError && <p className="text-xs text-destructive italic px-4">{currentImageError}</p>}
        <p className="text-sm text-muted-foreground italic">{currentStage.message}</p>
      </CardContent>
    </Card>
  );
}
