/**
 * Test script for the RAG system
 * Run with: npx tsx lib/rag/test.ts
 */

import { searchUDLGuidelines } from './search';
import { initializeRAG } from './initialize';

async function testRAG() {
  console.log('=== Testing RAG System ===\n');

  try {
    // Initialize the system
    console.log('1. Initializing RAG system...');
    await initializeRAG();
    console.log('✓ Initialization complete\n');

    // Test queries
    const testQueries = [
      'How to improve student engagement?',
      'Students missing assignments',
      'Make course accessible',
      'How to provide feedback to students?',
      'Support diverse learners',
    ];

    for (const query of testQueries) {
      console.log(`\n=== Query: "${query}" ===`);
      console.log('Searching...\n');

      const startTime = Date.now();
      const results = await searchUDLGuidelines(query, 3);
      const searchTime = Date.now() - startTime;

      console.log(results);
      console.log(`\nSearch completed in ${searchTime}ms`);
      console.log('---\n');
    }

    console.log('✓ All tests completed successfully');
  } catch (error) {
    console.error('✗ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testRAG().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

