# Course Design Companion

An AI-powered instructional support tool for higher education instructors. This tool helps instructors improve specific aspects of their courses using research-based pedagogical principles, providing concrete, actionable suggestions with evidence backing.

## Design Philosophy

This tool is designed with two key user types in mind:

1. **The Practical Skeptic** - Busy instructors who need quick, digestible help and want evidence that suggestions actually work
2. **The Evidence-Seeking Veteran** - Experienced instructors who want to understand the "why" behind suggestions and see discipline-specific examples

Key principles:
- Focus on solving specific instructor problems, not analyzing entire courses
- Provide concrete, actionable suggestions with examples
- Avoid overwhelming instructors with too much information or framework terminology
- Reduce cognitive load in both the tool's interface and the suggestions it provides
- Emphasize efficiency, practicality, and proof of effectiveness

## Features

- **Evidence-Based Suggestions** - All recommendations grounded in proven pedagogical research
- **One Problem at a Time** - Focused approach to avoid overwhelming instructors
- **Concrete Examples** - Small-scale, implementable suggestions with specific details
- **Trust-Building Elements** - Research backing and evidence cited naturally

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **OpenAI API** - GPT-5 nano for AI-powered responses
- **React Markdown** - Rich text formatting for bot responses
- **@xenova/transformers** - Local embeddings for RAG (no API costs)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HAII_final_project_2511
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   │   ├── initialize.ts         # Initialization utilities
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

## Deployment

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket

2. Import your repository to [Vercel](https://vercel.com)

3. Add your environment variable:
   - Go to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your API key

4. Deploy! Vercel will automatically build and deploy your app

### Alternative Deployment Options

- **Netlify**: Similar process, add environment variables in site settings
- **Railway**: Add environment variables in project settings
- **Self-hosted**: Build with `npm run build` and start with `npm start`

## Customization

### For Different Institutions

1. **Update branding**: Modify the header in `app/page.tsx`
2. **Customize sidebar links**: Edit `components/Sidebar.tsx` to point to your teaching center resources
3. **Adjust system prompt**: Modify the `SYSTEM_PROMPT` in `app/api/chat/route.ts` to match your institution's pedagogical approach
4. **Change example prompts**: Update `EXAMPLE_PROMPTS` array in `app/page.tsx`

### Switching AI Models

Currently using OpenAI's GPT-5 nano. To switch to Anthropic's Claude:

1. Install Anthropic SDK:
```bash
npm install @anthropic-ai/sdk
```

2. Update `app/api/chat/route.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Replace OpenAI call with Anthropic
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1500,
  messages: messages,
})
```

3. Update environment variable to `ANTHROPIC_API_KEY`

## Environment Variables

Create a `.env.local` file (not committed to git) with:

```
OPENAI_API_KEY=your_openai_api_key_here
```

For production, add this to your hosting platform's environment variables.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Explained

### Chat Interface
- Clean, fast-loading design
- Auto-scrolling to newest messages
- Character count for input
- Example prompts for quick start
- Loading states with trust-building messages

### Message Formatting
- Structured responses with clear sections:
  - Quick Summary
  - The Suggestion
  - Why This Works (evidence)
  - Start Small (concrete example)
  - How It Looks in Practice
- Markdown support for rich formatting
- Copy button for easy sharing

### Trust-Building
- Evidence cited naturally in responses
- Research backing without jargon
- Small-scale testing emphasized
- Acknowledgment of skepticism
- Sidebar with research information

## Contributing

This is a project for instructional support. To contribute:

1. Focus on maintaining the design philosophy (practical, evidence-based, low cognitive load)
2. Keep changes focused on specific problems
3. Test with actual instructors when possible
4. Maintain fast performance and clean UI

## License

[Add your license here]

## RAG System (Retrieval-Augmented Generation)

This tool uses RAG to provide accurate UDL-based suggestions by:

1. Searching the UDL Guidelines database for relevant content
2. Including that content in the context sent to the AI
3. Ensuring responses are grounded in actual UDL principles

### Technical Implementation

- **Embedding Model**: Xenova/all-MiniLM-L6-v2 (local, no API costs)
- **Vector Search**: Cosine similarity
- **Knowledge Base**: UDL Guidelines from CAST
- **Chunk Size**: 500-800 characters
- **Top Results**: 3 most relevant chunks per query

### How It Works

1. **Knowledge Loading**:** The system loads UDL guidelines from `/lib/udl_guidelines.json` and splits them into semantic chunks (500-800 characters each)

2. **Embedding Generation**:** Each chunk is converted to a vector embedding using the local transformer model (runs in Node.js, no external API calls)

3. **Caching**:** Embeddings are cached in `/lib/rag/embeddings_cache.json` for fast subsequent loads

4. **Search**:** When a user asks a question, the system:
   - Generates an embedding for the query
   - Searches for the 3 most similar chunks using cosine similarity
   - Includes those chunks in the context sent to the AI

5. **Response**:** The AI uses the retrieved UDL content to provide evidence-based suggestions

### Updating the Knowledge Base

1. Update `/lib/udl_guidelines.json` with new content
2. Delete `/lib/rag/embeddings_cache.json` (or it will be regenerated automatically if version changes)
3. Restart the server (embeddings will regenerate automatically on first request)

### Performance

- **First run**: ~30-60 seconds (downloading model + generating embeddings)
- **Subsequent runs**: <1 second (loading from cache)
- **Search time**: ~100-300ms per query
- **Model size**: ~50MB (one-time download)

### Testing the RAG System

Run the test script to verify everything is working:

```bash
npm run test:rag
```

Or directly:

```bash
npx tsx lib/rag/test.ts
```

This will:
- Initialize the RAG system
- Test several sample queries
- Display retrieved chunks and similarity scores

### Troubleshooting

**Embeddings fail to generate:**
- Check that `/lib/udl_guidelines.json` exists and is valid JSON
- Ensure you have sufficient disk space (~50MB for model)
- Check console logs for specific error messages

**Search is slow:**
- First search after server restart may be slow (loading model)
- Subsequent searches should be fast (<500ms)
- If consistently slow, check system resources

**Cache issues:**
- Delete `/lib/rag/embeddings_cache.json` to force regeneration
- Cache is automatically invalidated if the version changes
- Cache file is created automatically on first run

**RAG not working:**
- Check that the API route can import from `@/lib/rag/search`
- Verify embeddings were generated (check for cache file)
- Check server logs for errors
- The system will gracefully fall back to general responses if RAG fails

### Technical Details

- **Embedding Dimensions**: 384 (from all-MiniLM-L6-v2)
- **Similarity Metric**: Cosine similarity (normalized dot product)
- **Chunking Strategy**: Sentence-based with 100-character overlap
- **Batch Processing**: Embeddings generated in batches of 32 for efficiency

## Support

For questions or issues:
- Check the sidebar in the app for teaching center resources
- Review the system prompt to understand the AI's approach
- Customize for your institution's needs

---

**Note**: This tool is designed to support instructors, not replace human expertise. Always encourage scaling up successful small-scale tests with expert consultation.

