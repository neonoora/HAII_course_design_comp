/**
 * Main search function for UDL guidelines
 */

import { getVectorStore } from './vectorStore';
import { SearchResult } from './types';

/**
 * Search UDL guidelines for relevant content
 * @param query - The search query
 * @param topK - Number of top results to return (default: 3)
 * @returns Formatted string with relevant UDL content for Claude prompt
 */
export async function searchUDLGuidelines(
  query: string,
  topK: number = 3
): Promise<string> {
  try {
    const vectorStore = getVectorStore();
    const results = await vectorStore.search(query, topK);

    if (results.length === 0) {
      return 'No relevant UDL guidelines found.';
    }

    // Format results for AI prompt - emphasize guideline numbers
    const formattedResults = results.map((result: SearchResult, index: number) => {
      const { chunk, score } = result;
      const { 
        title, 
        url, 
        guideline, 
        guideline_number, 
        guideline_name, 
        sub_guideline, 
        principle 
      } = chunk.metadata;

      let formatted = `[Result ${index + 1}] (Relevance: ${(score * 100).toFixed(1)}%)\n`;
      
      // Prioritize displaying guideline number prominently
      if (guideline_number) {
        formatted += `**UDL Guideline ${guideline_number}**`;
        if (guideline_name) {
          formatted += `: ${guideline_name}`;
        }
        formatted += `\n`;
      } else if (guideline) {
        formatted += `**${guideline}**\n`;
      }
      
      if (principle) {
        formatted += `Principle: ${principle}\n`;
      }
      
      if (sub_guideline) {
        formatted += `Sub-guideline: ${sub_guideline}\n`;
      }
      
      formatted += `Source: ${title}\n`;
      formatted += `URL: ${url}\n`;
      formatted += `Content:\n${chunk.text}\n`;
      formatted += '---\n';

      return formatted;
    }).join('\n');

    return `Relevant UDL Guidelines:\n\n${formattedResults}`;
  } catch (error) {
    console.error('Error searching UDL guidelines:', error);
    // Return graceful fallback
    return 'Unable to retrieve UDL guidelines at this time. Please proceed with general instructional design principles.';
  }
}

