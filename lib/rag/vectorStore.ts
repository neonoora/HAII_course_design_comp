/**
 * Vector store for storing and searching UDL guideline embeddings
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { UDLChunk, SearchResult, EmbeddingCache } from './types';
import { loadUDLKnowledge } from './loadKnowledge';
import { generateBatchEmbeddings, generateEmbedding } from './embeddings';

const CACHE_FILE = join(process.cwd(), 'lib', 'rag', 'embeddings_cache.json');
const CACHE_VERSION = '1.0.0';

export class VectorStore {
  private chunks: UDLChunk[] = [];
  private embeddings: number[][] = [];
  private initialized: boolean = false;

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    if (denominator === 0) {
      return 0;
    }

    return dotProduct / denominator;
  }

  /**
   * Load embeddings from cache if available
   */
  private loadFromCache(): boolean {
    try {
      if (!existsSync(CACHE_FILE)) {
        return false;
      }

      const cacheContent = readFileSync(CACHE_FILE, 'utf-8');
      const cache: EmbeddingCache = JSON.parse(cacheContent);

      // Verify cache version
      if (cache.version !== CACHE_VERSION) {
        console.log('Cache version mismatch, will regenerate');
        return false;
      }

      this.chunks = cache.chunks;
      this.embeddings = cache.embeddings;
      console.log(`Loaded ${this.chunks.length} embeddings from cache`);
      return true;
    } catch (error) {
      console.error('Error loading cache:', error);
      return false;
    }
  }

  /**
   * Save embeddings to cache
   */
  private saveToCache(): void {
    try {
      const cache: EmbeddingCache = {
        chunks: this.chunks,
        embeddings: this.embeddings,
        version: CACHE_VERSION,
        createdAt: new Date().toISOString(),
      };

      writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      console.log(`Saved ${this.chunks.length} embeddings to cache`);
    } catch (error) {
      console.error('Error saving cache:', error);
      // Don't throw - caching is optional
    }
  }

  /**
   * Initialize the vector store (load or generate embeddings)
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const startTime = Date.now();

    // Try to load from cache first
    if (this.loadFromCache()) {
      this.initialized = true;
      const loadTime = Date.now() - startTime;
      console.log(`Vector store initialized from cache in ${loadTime}ms`);
      return;
    }

    // Generate embeddings if cache doesn't exist
    console.log('Generating embeddings (this may take 30-60 seconds)...');
    this.chunks = loadUDLKnowledge();

    if (this.chunks.length === 0) {
      throw new Error('No chunks loaded from UDL guidelines');
    }

    // Generate embeddings for all chunks
    const texts = this.chunks.map((chunk) => chunk.text);
    this.embeddings = await generateBatchEmbeddings(texts);

    if (this.embeddings.length !== this.chunks.length) {
      throw new Error('Mismatch between chunks and embeddings count');
    }

    // Save to cache
    this.saveToCache();

    this.initialized = true;
    const initTime = Date.now() - startTime;
    console.log(`Vector store initialized in ${initTime}ms`);
  }

  /**
   * Search for most similar chunks to a query
   */
  async search(query: string, topK: number = 3): Promise<SearchResult[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.chunks.length === 0 || this.embeddings.length === 0) {
      throw new Error('Vector store is not properly initialized');
    }

    const searchStartTime = Date.now();

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarities
    const similarities: { index: number; score: number }[] = [];
    for (let i = 0; i < this.embeddings.length; i++) {
      const similarity = this.cosineSimilarity(queryEmbedding, this.embeddings[i]);
      similarities.push({ index: i, score: similarity });
    }

    // Sort by similarity (descending) and take top K
    similarities.sort((a, b) => b.score - a.score);
    const topResults = similarities.slice(0, topK);

    const results: SearchResult[] = topResults.map(({ index, score }) => ({
      chunk: this.chunks[index],
      score,
    }));

    const searchTime = Date.now() - searchStartTime;
    if (searchTime > 2000) {
      console.warn(`Search took ${searchTime}ms (exceeds 2 second threshold)`);
    }

    return results;
  }

  /**
   * Get statistics about the vector store
   */
  getStats(): { chunkCount: number; embeddingDimensions: number; cacheExists: boolean } {
    return {
      chunkCount: this.chunks.length,
      embeddingDimensions: this.embeddings.length > 0 ? this.embeddings[0].length : 0,
      cacheExists: existsSync(CACHE_FILE),
    };
  }

  /**
   * Clear cache (useful for forcing regeneration)
   */
  clearCache(): void {
    try {
      if (existsSync(CACHE_FILE)) {
        unlinkSync(CACHE_FILE);
        console.log('Cache cleared');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

// Singleton instance
let vectorStoreInstance: VectorStore | null = null;

/**
 * Get the singleton vector store instance
 */
export function getVectorStore(): VectorStore {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new VectorStore();
  }
  return vectorStoreInstance;
}

