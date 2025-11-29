'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatMessage({
  id,
  text,
  sender,
  timestamp,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }


  if (sender === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] md:max-w-[75%]">
          <div className="bg-blue-500 dark:bg-blue-600 text-white rounded-lg px-4 py-3 shadow-sm">
            <p className="whitespace-pre-wrap break-words">{text}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right pr-2">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%] md:max-w-[75%]">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 shadow-sm">
          <div className="markdown-content prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Customize heading styles
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4 dark:text-gray-100" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3 dark:text-gray-100" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-bold mb-1 mt-2 dark:text-gray-100" {...props} />,
                // Bold text
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />,
                // Italic text
                em: ({node, ...props}) => <em className="italic dark:text-gray-300" {...props} />,
                // Bullet lists - use list-outside to keep bullets on same line
                ul: ({node, ...props}) => <ul className="list-disc list-outside mb-2 space-y-1 ml-6 pl-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside mb-2 space-y-1 ml-6 pl-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-800 dark:text-gray-200 leading-relaxed" {...props} />,
                // Paragraphs
                p: ({node, ...props}) => <p className="mb-2 text-gray-800 dark:text-gray-200 leading-relaxed" {...props} />,
                // Code blocks
                code: ({node, inline, ...props}: any) => 
                  inline ? (
                    <code className="bg-gray-200 dark:bg-gray-600 dark:text-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                  ) : (
                    <code className="block bg-gray-200 dark:bg-gray-600 dark:text-gray-100 p-2 rounded text-sm font-mono overflow-x-auto" {...props} />
                  ),
                pre: ({node, ...props}) => <pre className="bg-gray-200 dark:bg-gray-600 dark:text-gray-100 p-2 rounded mb-2 overflow-x-auto" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(timestamp)}</p>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
            title="Copy response"
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

