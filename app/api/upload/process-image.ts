/** biome-ignore-all lint/suspicious/noConsole: "Handy for debugging" */

import { FatalError } from "workflow";
import { generateDescription } from "./generate-description";
import { indexImage } from "./index-image";
import { uploadImage } from "./upload-image";

type SerializableFile = {
  buffer: ArrayBuffer;
  name: string;
  type: string;
  size: number;
};

// Helper function to generate concise title (3 words max)
function generateConciseTitle(text: string): string {
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2)
    .slice(0, 3);
  return words.join(" ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// Helper function to generate marketing description
function generateMarketingDescription(text: string): string {
  // Extract key elements for marketing description
  const isTattoo =
    text.toLowerCase().includes("tattoo") ||
    text.toLowerCase().includes("ink") ||
    text.toLowerCase().includes("body art");

  // Basic structure for marketing description
  let description = "";

  // Style/color analysis
  if (
    text.toLowerCase().includes("black and white") ||
    text.toLowerCase().includes("monochrome")
  ) {
    description += "A striking black and white tattoo design ";
  } else if (
    text.toLowerCase().includes("color") ||
    text.toLowerCase().includes("colored")
  ) {
    description += "A vibrant colored tattoo design ";
  } else {
    description += "An intricate tattoo design ";
  }

  // Size/placement suggestions
  if (
    text.toLowerCase().includes("small") ||
    text.toLowerCase().includes("minimal")
  ) {
    description += "perfect for small placements. ";
  } else if (
    text.toLowerCase().includes("large") ||
    text.toLowerCase().includes("bold")
  ) {
    description += "ideal for larger canvas work. ";
  } else {
    description += "suitable for various body placements. ";
  }

  // Meaning/symbolism
  if (
    text.toLowerCase().includes("strength") ||
    text.toLowerCase().includes("power")
  ) {
    description +=
      "Symbolizing strength and resilience, this design captures the essence of inner power. ";
  } else if (
    text.toLowerCase().includes("love") ||
    text.toLowerCase().includes("heart")
  ) {
    description +=
      "Expressing deep emotion and connection, this piece represents love in its purest form. ";
  } else if (
    text.toLowerCase().includes("freedom") ||
    text.toLowerCase().includes("spirit")
  ) {
    description +=
      "Embodying freedom and spirituality, this tattoo speaks to the wandering soul. ";
  } else {
    description +=
      "Carrying deep personal meaning, this design tells your unique story. ";
  }

  // Non-salesy CTA
  description +=
    "Consider bringing this vision to life as part of your personal art collection.";

  return description;
}

export const processImage = async (fileData: SerializableFile) => {
  "use workflow";

  const workflowStartTime = Date.now();

  try {
    console.log(
      `[WORKFLOW] Starting image processing workflow for ${fileData.name}`
    );
    console.log("[WORKFLOW] File details:", {
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
    });

    // Step 1: Upload image to Blob Storage
    console.log("[WORKFLOW] Step 1/3: Uploading image");
    const blob = await uploadImage(fileData);
    console.log(
      `[WORKFLOW] Step 1/3 complete. Uploaded to ${blob.downloadUrl}`
    );

    // Step 2: Generate description using AI
    console.log("[WORKFLOW] Step 2/3: Generating description");
    const details = await generateDescription(blob);
    console.log(
      `[WORKFLOW] Step 2/3 complete. Generated ${details.length} characters`
    );

    // Step 3: Index in search with metadata
    console.log("[WORKFLOW] Step 3/3: Indexing in search");

    // Generate marketing description instead of full AI output
    const marketingDescription = generateMarketingDescription(details);
    const title = generateConciseTitle(details);

    await indexImage(blob, marketingDescription, {
      source: "user",
      visibility: "public",
      title,
      indexedAt: new Date().toISOString(),
      // Store the original detailed AI description privately
      originalPrompt: details,
      marketingDescription,
    });
    console.log("[WORKFLOW] Step 3/3 complete. Image indexed successfully");

    const workflowDuration = Date.now() - workflowStartTime;
    console.log(
      `[WORKFLOW] Successfully processed image ${fileData.name} in ${workflowDuration}ms`
    );

    return {
      success: true,
      pathname: blob.pathname,
      imageUrl: blob.url,
      processingTime: workflowDuration,
    };
  } catch (error) {
    const workflowDuration = Date.now() - workflowStartTime;
    const message = error instanceof Error ? error.message : "Unknown error";
    const isFatal = error instanceof FatalError;

    console.error(
      `[WORKFLOW] ${isFatal ? "Fatal" : "Retryable"} error after ${workflowDuration}ms:`,
      message
    );

    throw error;
  }
};
