/**
 * Loads UDL guidelines from JSON and splits them into chunks
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { UDLChunk, UDLGuideline } from './types';

const CHUNK_MIN_SIZE = 500;
const CHUNK_MAX_SIZE = 800;
const CHUNK_OVERLAP = 100; // Overlap between chunks to preserve context

/**
 * Split text into sentences (simple approach)
 */
function splitIntoSentences(text: string): string[] {
  // Split on sentence endings, but preserve them
  const sentences = text
    .split(/([.!?]\s+)/)
    .filter((s) => s.trim().length > 0)
    .reduce((acc: string[], curr, idx, arr) => {
      if (idx % 2 === 0) {
        acc.push(curr + (arr[idx + 1] || ''));
      }
      return acc;
    }, [])
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // If no sentences found, split on newlines
  if (sentences.length === 0) {
    return text.split(/\n+/).filter((s) => s.trim().length > 0);
  }

  return sentences;
}

/**
 * Split text into chunks of appropriate size
 */
function chunkText(text: string): string[] {
  const chunks: string[] = [];
  const sentences = splitIntoSentences(text);

  let currentChunk = '';

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const testChunk = currentChunk
      ? `${currentChunk} ${sentence}`
      : sentence;

    // If adding this sentence would exceed max size, save current chunk
    if (testChunk.length > CHUNK_MAX_SIZE && currentChunk.length >= CHUNK_MIN_SIZE) {
      chunks.push(currentChunk.trim());
      // Start new chunk with overlap from previous chunk
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(CHUNK_OVERLAP / 10)); // Approximate overlap
      currentChunk = overlapWords.join(' ') + ' ' + sentence;
    } else {
      currentChunk = testChunk;
    }
  }

  // Add remaining chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length >= CHUNK_MIN_SIZE);
}

/**
 * Extract metadata from guideline object
 * Uses the new metadata fields if available, otherwise falls back to extraction
 */
function extractMetadata(guideline: UDLGuideline): {
  guideline?: string;
  guideline_number?: string;
  guideline_name?: string;
  sub_guideline?: string;
  principle?: string;
} {
  // Use metadata fields from JSON if available
  if (guideline.principle || guideline.guideline_number || guideline.guideline_name || guideline.sub_guideline) {
    return {
      principle: guideline.principle,
      guideline_number: guideline.guideline_number,
      guideline_name: guideline.guideline_name,
      sub_guideline: guideline.sub_guideline,
      // Create legacy guideline field for backward compatibility
      guideline: guideline.guideline_number ? `Guideline ${guideline.guideline_number}` : undefined,
    };
  }

  // Fallback: Extract from URL or content if metadata not available
  const url = guideline.url.toLowerCase();
  const content = guideline.content.toLowerCase();

  // Extract principle from URL
  let principle: string | undefined;
  if (url.includes('/engagement/')) {
    principle = 'Engagement';
  } else if (url.includes('/representation/')) {
    principle = 'Representation';
  } else if (url.includes('/action-expression/')) {
    principle = 'Action & Expression';
  }

  // Extract guideline number
  let guidelineNum: string | undefined;
  const guidelineMatch = content.match(/guideline\s+(\d+(?:\.\d+)?)/i);
  if (guidelineMatch) {
    guidelineNum = guidelineMatch[1];
  }

  return {
    guideline: guidelineNum ? `Guideline ${guidelineNum}` : undefined,
    guideline_number: guidelineNum,
    principle,
  };
}

/**
 * Load UDL guidelines from JSON file and split into chunks
 */
export function loadUDLKnowledge(): UDLChunk[] {
  try {
    const filePath = join(process.cwd(), 'lib', 'udl_guidelines.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const guidelines: UDLGuideline[] = JSON.parse(fileContent);

    const chunks: UDLChunk[] = [];

    for (const guideline of guidelines) {
      // Skip if content is too short
      if (!guideline.content || guideline.content.trim().length < CHUNK_MIN_SIZE) {
        continue;
      }

      // Extract metadata (now handled inside the loop)

      // Split content into chunks
      const textChunks = chunkText(guideline.content);

      // Create chunk objects with metadata
      const metadata = extractMetadata(guideline);
      for (const chunkText of textChunks) {
        chunks.push({
          text: chunkText,
          metadata: {
            title: guideline.title || 'UDL Guidelines',
            url: guideline.url,
            ...metadata, // Include all extracted metadata
          },
        });
      }
    }

    console.log(`Loaded ${chunks.length} chunks from ${guidelines.length} guidelines`);
    return chunks;
  } catch (error) {
    console.error('Error loading UDL knowledge:', error);
    throw new Error(`Failed to load UDL guidelines: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

