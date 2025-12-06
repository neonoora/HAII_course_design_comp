# Course Design Companion

An AI-powered instructional support tool for higher education instructors. This tool helps instructors improve specific aspects of their courses using research-based pedagogical principles (i.e., UDL), providing concrete, actionable suggestions with evidence backing.

Access the APP: https://haii-course-design-comp.vercel.app/

Note: If you see warnings like “something went wrong,” it’s probably because I ran out of OpenAI API credits. Feel free to let me know at hainuoc@andrew.cmu.edu

AI use: For this project, I used ChatGPT and Cursor to help build the UI, refine the system prompt, and write the RAG and embedding code.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **OpenAI API** - GPT-4 for AI-powered responses and text-embedding-3-small for embeddings
- **React Markdown** - Rich text formatting for bot responses

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint for OpenAI integration
│   ├── globals.css                # Global styles and Tailwind imports
│   ├── layout.tsx                 # Root layout component
│   └── page.tsx                   # Main chat interface page
├── components/
│   ├── ChatMessage.tsx            # Message component with markdown support
│   └── Sidebar.tsx                # Sidebar with trust-building elements
├── lib/                           # Utility functions
│   ├── rag/                       # RAG system components
│   │   ├── types.ts               # TypeScript type definitions
│   │   ├── loadKnowledge.ts       # Loads and chunks UDL guidelines
│   │   ├── embeddings.ts          # Generates embeddings
│   │   ├── vectorStore.ts         # Vector store and search
│   │   ├── search.ts              # Main search function
│   │   ├── initialize.ts          # Initialization utilities
│   │   └── test.ts                # Test script
│   └── udl_guidelines.json        # UDL Guidelines knowledge base
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in git)
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## RAG System (Retrieval-Augmented Generation)

This tool uses RAG to provide accurate UDL-based suggestions by searching the UDL Guidelines database for relevant content and including it in the context sent to the AI.

### Technical Implementation

- **Embedding Model**: OpenAI text-embedding-3-small
- **Vector Search**: Cosine similarity
- **Knowledge Base**: UDL Guidelines from CAST
- **Chunk Size**: 500-800 characters
- **Top Results**: 3 most relevant chunks per query
- **Embedding Dimensions**: 1536 (from text-embedding-3-small)
- **Similarity Metric**: Cosine similarity (normalized dot product)
- **Chunking Strategy**: Sentence-based with 100-character overlap
- **Batch Processing**: Embeddings generated in batches of 64 for efficiency

### How It Works

1. **Knowledge Loading**: The system loads UDL guidelines from `/lib/udl_guidelines.json` and splits them into semantic chunks (500-800 characters each)

2. **Embedding Generation**: Each chunk is converted to a vector embedding using OpenAI's text-embedding-3-small API

3. **Caching**: Embeddings are cached in `/lib/rag/embeddings_cache.json` for fast subsequent loads

4. **Search**: When a user asks a question, the system:
   - Generates an embedding for the query
   - Searches for the 3 most similar chunks using cosine similarity
   - Includes those chunks in the context sent to the AI

5. **Response**: The AI uses the retrieved UDL content to provide evidence-based suggestions
