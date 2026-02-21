'use client'

/**
 * components/chat/ChatWidget.tsx
 *
 * BUG 13 FIXED: useEffect scroll dependency was [messages] — the whole array
 * object reference — causing scroll on EVERY render even when nothing changed.
 * Changed to [messages.length] which is a stable primitive that only changes
 * when new messages are actually added.
 *
 * All other logic is UNCHANGED.
 *
 * FILE PATH: components/chat/ChatWidget.tsx
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; url: string }[]
  timestamp: Date
  isStreaming?: boolean
}

const suggestedQuestions = [
  'What services do you offer?',
  'How can you help with market research?',
  'What industries do you serve?',
  'Tell me about your data collection methods',
]

export default function ChatWidget() {
  const [isOpen, setIsOpen]     = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi there! I'm part of the Avance Insights team. I'm here to help you with any questions about our market research services, data collection, or how we can work together. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput]       = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)
  // Guard ref prevents double-fire from React StrictMode or quick clicks
  const fetchingRef    = useRef(false)

  // FIX BUG 13: was [messages] (whole array object — unstable reference).
  // Changed to [messages.length] — primitive value, only changes on new messages.
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (messages.length > 1) {
      const timer = setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
        80
      )
      return () => clearTimeout(timer)
    }
  }, [messages.length]) // ← FIXED: was [messages]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = useCallback(
    async (overrideInput?: string) => {
      const messageContent = (overrideInput ?? input).trim()
      if (!messageContent || isLoading || fetchingRef.current) return

      fetchingRef.current = true
      setIsLoading(true)
      setError(null)

      const assistantMessageId = `${Date.now()}-assistant`
      const userMessage: Message = {
        id: `${Date.now()}-user`,
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      if (!overrideInput) setInput('')

      try {
        const chatResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageContent,
            history: messages
              .slice(-10)
              .map((m) => ({ role: m.role, content: m.content })),
            stream: true,
          }),
        })

        if (!chatResponse.ok) throw new Error('Failed to connect')

        const reader = chatResponse.body?.getReader()
        if (!reader) throw new Error('No reader')

        const decoder = new TextDecoder()
        let assistantContent = ''
        
        // Add an initial empty assistant message
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
          },
        ])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6)
              if (dataStr === '[DONE]') continue
              
              try {
                const data = JSON.parse(dataStr)
                if (data.content) {
                  assistantContent += data.content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: assistantContent }
                        : msg
                    )
                  )
                }
                if (data.sources) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, sources: data.sources }
                        : msg
                    )
                  )
                }
              } catch (e) {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
          )
        )
      } catch (err) {
        console.error('Chat Error:', err)
        setError('Connection issue. Please try again.')
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
        fetchingRef.current = false
      }
    },
    [input, isLoading, messages]
  )

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    handleSend(question)
  }

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow',
          isOpen && 'hidden'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 p-5 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                      <Bot className="w-7 h-7" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-primary-500 shadow-sm" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Avance AI</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-xs text-white/90 font-medium">Online • Assistant</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMessages([{ id: '1', role: 'assistant', content: 'How can I help you further?', timestamp: new Date() }])}
                    className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
                    title="Reset conversation"
                  >
                    <RefreshCcw className="w-4 h-4 text-white/80" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-secondary-200">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx === messages.length - 1 ? 0 : 0 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm',
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-primary-50 to-white text-primary-600 border border-primary-100'
                        : 'bg-gradient-to-br from-secondary-100 to-secondary-50 text-secondary-600 border border-secondary-200'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3.5 shadow-sm relative group',
                      message.role === 'assistant'
                        ? 'bg-white border border-secondary-100 text-secondary-800 rounded-tl-none'
                        : 'bg-primary-600 text-white rounded-tr-none'
                    )}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content || (message.role === 'assistant' && !message.isStreaming && idx === messages.length - 1 ? (
                        <div className="flex gap-1 items-center py-1">
                          <div className="w-1.5 h-1.5 bg-secondary-300 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-secondary-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-secondary-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      ) : message.content)}
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-3 border-t border-secondary-100"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-400 mb-2.5">
                          Referenced Insights
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, i) => (
                            <a
                              key={i}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary-50 hover:bg-primary-50 rounded-lg text-xs text-primary-600 transition-colors border border-secondary-100 hover:border-primary-200"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{source.title}</span>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    <span className={cn(
                      "text-[9px] mt-1.5 block opacity-0 group-hover:opacity-100 transition-opacity",
                      message.role === 'assistant' ? "text-secondary-400" : "text-white/60"
                    )}>
                      {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-2xl bg-white border border-primary-100 text-primary-600 flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-secondary-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative w-4 h-4">
                        <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                      </div>
                      <span className="text-xs font-medium text-secondary-500 animate-pulse">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions (only shown on first load) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-secondary-500 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-5 bg-white border-t border-secondary-100">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg mb-3 text-center font-medium border border-red-100"
                >
                  {error}
                </motion.div>
              )}
              <div className="relative flex items-center gap-2 bg-secondary-50 p-1.5 rounded-[22px] border border-secondary-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/5 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="How can Avance help you?"
                  className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none placeholder:text-secondary-400 text-secondary-900"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md',
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-primary-500/25'
                      : 'bg-secondary-200 text-secondary-400'
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </motion.button>
              </div>
              <p className="text-[10px] text-center text-secondary-400 mt-3 font-medium">
                Avance AI can make mistakes. Consider checking important info.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}