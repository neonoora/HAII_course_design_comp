/**
 * TypeScript types for the RAG system
 */

export interface UDLChunk {
  text: string;
  metadata: {
    title: string;
    url: string;
    guideline?: string; // Legacy field
    guideline_number?: string; // New field: e.g., "7.1", "8.2"
    guideline_name?: string; // New field: e.g., "Optimize choice and autonomy"
    sub_guideline?: string; // New field: e.g., "Welcoming Interests & Identities"
    principle?: string;
  };
}

export interface SearchResult {
  chunk: UDLChunk;
  score: number;
}

export interface EmbeddingCache {
  chunks: UDLChunk[];
  embeddings: number[][];
  version: string;
  createdAt: string;
}

export interface UDLGuideline {
  url: string;
  title: string;
  content: string;
  source?: string;
  principle?: string;
  guideline_number?: string;
  guideline_name?: string;
  sub_guideline?: string;
}

