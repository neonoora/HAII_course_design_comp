/**
 * Initialize the RAG system by pre-generating embeddings
 * This can be called on server startup or via an API route
 */

import { getVectorStore } from './vectorStore';

/**
 * Initialize the RAG system
 * This will load embeddings from cache if available, or generate them if not
 */
export async function initializeRAG(): Promise<void> {
  try {
    console.log('Initializing RAG system...');
    const vectorStore = getVectorStore();
    await vectorStore.initialize();
    console.log('RAG system initialized successfully');
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    throw error;
  }
}

/**
 * Get initialization status and statistics
 */
export async function getRAGStatus(): Promise<{
  initialized: boolean;
  stats: {
    chunkCount: number;
    embeddingDimensions: number;
    cacheExists: boolean;
  };
}> {
  try {
    const vectorStore = getVectorStore();
    const stats = vectorStore.getStats();
    
    // Try to initialize if not already done (non-blocking check)
    let initialized = false;
    try {
      await vectorStore.initialize();
      initialized = true;
    } catch (error) {
      console.error('Error checking initialization:', error);
    }

    return {
      initialized,
      stats,
    };
  } catch (error) {
    console.error('Error getting RAG status:', error);
    return {
      initialized: false,
      stats: {
        chunkCount: 0,
        embeddingDimensions: 0,
        cacheExists: false,
      },
    };
  }
}

