/**
 * Generate embeddings using OpenAI's hosted embeddings API.
 *
 * This replaces the local @xenova/transformers model to avoid
 * cold starts, model downloads, and serverless timeouts.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
// Smaller batch size is still helpful if you ever embed large lists
const BATCH_SIZE = 64;

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
      throw new Error('No embedding returned from OpenAI');
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate embeddings for multiple texts in batches
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings: number[][] = [];

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Process in batches to avoid hitting request size limits
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      console.log(
        `Generating embeddings for batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          texts.length / BATCH_SIZE
        )}...`
      );

      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch,
      });

      for (const item of response.data) {
        if (!item.embedding) {
          throw new Error('Missing embedding in batch response');
        }
        embeddings.push(item.embedding);
      }
    }

    return embeddings;
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

