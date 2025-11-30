'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from '@/components/ChatMessage'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const INITIAL_BOT_MESSAGE = "Hi! I'm here to help you tackle **specific teaching challenges**—whether that's redesigning an assignment, boosting engagement in a lesson, or supporting students with varied backgrounds.\n\n **- I work best with:** Focused questions about particular activities, assignments, or teaching moments.\n Learn more about me in <**About the Tool**>\n\n**- For bigger projects** (full course design, syllabus reviews): check out the <**Resource Hub**> for one-on-one support\n\n**! Fair warning:** My suggestions are evidence-based starting points, but every classroom is different. You're the expert on your students!\n\nWhat specific challenge would you like help with today?"
export default function Home() {
  // Initialize with bot message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: INITIAL_BOT_MESSAGE,
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [helpPanelOpen, setHelpPanelOpen] = useState(false)
  const [resourceHubOpen, setResourceHubOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null) // Track which section is open
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setError('Sorry, something went wrong. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }


  const handleNewConversation = () => {
    setMessages([
      {
        id: 'initial',
        text: INITIAL_BOT_MESSAGE,
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
    setInput('')
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }


  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Course Design Companion
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                Quick help for specific teaching challenges
              </p>
            </div>
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => {
                  setHelpPanelOpen(!helpPanelOpen)
                  if (!helpPanelOpen) setResourceHubOpen(false)
                }}
                className="px-3 lg:px-4 py-2 text-xs lg:text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg transition-colors font-medium"
              >
                About the Tool
              </button>
              <button
                onClick={() => {
                  setResourceHubOpen(!resourceHubOpen)
                  if (!resourceHubOpen) setHelpPanelOpen(false)
                }}
                className="px-3 lg:px-4 py-2 text-xs lg:text-sm text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors font-medium"
              >
                Resource Hub
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                )}
              </button>
            </div>
            {/* Mobile hamburger menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <button
                onClick={() => {
                  setHelpPanelOpen(!helpPanelOpen)
                  setMobileMenuOpen(false)
                  if (!helpPanelOpen) setResourceHubOpen(false)
                }}
                className="w-full px-4 py-2 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg transition-colors font-medium text-left"
              >
                About the Tool
              </button>
              <button
                onClick={() => {
                  setResourceHubOpen(!resourceHubOpen)
                  setMobileMenuOpen(false)
                  if (!resourceHubOpen) setHelpPanelOpen(false)
                }}
                className="w-full px-4 py-2 text-sm text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors font-medium text-left"
              >
                Resource Hub
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Messages area - scrollable */}
          <div className="flex-1 overflow-y-auto chat-scrollbar px-3 sm:px-4 lg:px-8 py-4 sm:py-6 min-h-0">
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  text={message.text}
                  sender={message.sender}
                  timestamp={message.timestamp}
                />
              ))}

              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-sm">
                        Thinking ...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg px-4 py-3 mb-4 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area - fixed at bottom */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              {messages.length > 1 && (
                <button
                  onClick={handleNewConversation}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap font-medium self-start sm:self-auto"
                >
                  New Conversation
                </button>
              )}
              <div className="flex-1 max-w-3xl mx-auto w-full">
                <div className="flex gap-2 sm:gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-16 sm:pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none max-h-32 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      rows={1}
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Help Panel - popup window from upper right corner, doesn't cover header/footer */}
        {helpPanelOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setHelpPanelOpen(false)}
          />
        )}
        <div
          className={`fixed right-0 sm:right-4 w-full sm:w-[90%] md:w-[50%] lg:w-[30%] bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg transform transition-all duration-300 ease-in-out z-40 flex flex-col ${
            helpPanelOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          }`}
          style={{
            top: '70px', // Below header (adjusted for mobile)
            bottom: '80px', // Above footer/input area (adjusted for mobile)
            maxHeight: 'calc(100vh - 150px)', // Ensures it never covers header or footer
          }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                About the Tool
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Learn more about how this tool works
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-3">

              {/* Evidence-based support */}
              <section className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === 'evidence' ? null : 'evidence')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    Evidence-Based Support
                  </h3>
                  <svg
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 transform transition-transform ${
                      openSection === 'evidence' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openSection === 'evidence' && (
                  <div className="px-4 pb-4">
                    <div className="space-y-4 text-xs text-gray-700 dark:text-gray-300">
                      <div>
                        <p className="mb-2"><br></br>
                          All suggestions are grounded in the <strong>UDL Guidelines</strong> from CAST (Center for Applied Special Technology), which are based on decades of research in neuroscience and education.
                        </p>
                      </div>
                      <div>
                        <p className="mb-2">
                          The tool uses <strong>Retrieval-Augmented Generation (RAG)</strong> to search through official UDL Guidelines and provide you with:
                        </p>
                        <ul className="list-disc list-inside ml-2 space-y-1 dark:text-gray-300">
                          <li>Specific guideline numbers for verification</li>
                          <li>Research-backed strategies</li>
                          <li>Practical implementation examples</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                        <p className="text-xs text-blue-900 dark:text-blue-200">
                          <strong>Note:</strong> Each response includes citations to specific UDL Guidelines at the end, so you can verify the sources and learn more.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Tips */}
              <section className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === 'tips' ? null : 'tips')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    Tips for Best Results
                  </h3>
                  <svg
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 transform transition-transform ${
                      openSection === 'tips' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openSection === 'tips' && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                        <span>Be specific about your challenge (e.g., "Students struggle with deadlines" rather than "My course needs improvement")</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                        <span>Share context about your course topic, student level, and format</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                        <span>Focus on one problem at a time for more targeted suggestions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                        <span>Ask follow-up questions to dive deeper into specific strategies</span>
                      </li>
                    </ul>
                  </div>
                )}
              </section>

              {/* Who made this tool */}
              <section className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === 'who-made' ? null : 'who-made')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    Who made this tool?
                  </h3>
                  <svg
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 transform transition-transform ${
                      openSection === 'who-made' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openSection === 'who-made' && (
                  <div className="px-4 pb-4">
                    <div className="text-xs text-gray-700 dark:text-gray-300">
                      <p className="mb-2">
                        <strong>Hainuo (Nora) Chen</strong>
                      </p>
                      <p>
                        <a 
                          href="mailto:hainuoc@andrew.cmu.edu" 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                        >
                          hainuoc@andrew.cmu.edu
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Resource Hub Panel - popup window from upper right corner, doesn't cover header/footer */}
        {resourceHubOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setResourceHubOpen(false)}
          />
        )}
        <div
          className={`fixed right-0 sm:right-4 w-full sm:w-[90%] md:w-[50%] lg:w-[30%] bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg transform transition-all duration-300 ease-in-out z-40 flex flex-col ${
            resourceHubOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          }`}
          style={{
            top: '70px', // Below header (adjusted for mobile)
            bottom: '80px', // Above footer/input area (adjusted for mobile)
            maxHeight: 'calc(100vh - 150px)', // Ensures it never covers header or footer
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Resource Hub
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Access helpful resources and support
              </p>
            </div>

            {/* Links */}
            <div className="space-y-2 sm:space-y-3">
              <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <a
                  href="https://www.cmu.edu/teaching/consultation/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 underline"
                >
                  <span className="break-words pr-2">1-on-1 Consultation Sign Up</span>
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  1-hour in-personconsultation with an instructional designer
                </p>
              </div>
              <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <a
                  href="https://www.cmu.edu/teaching/programs/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 underline"
                >
                  <span className="break-words pr-2">Fellowship Workshop Sign Up</span>
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Professional development workshops for structured learning
                </p>
              </div>
              <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <a
                  href="https://udlguidelines.cast.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 underline"
                >
                  <span className="break-words pr-2">UDL Principles</span>
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Research based principles for inclusive & accessible learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

