'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Sparkles,
  ExternalLink,
  RefreshCw,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; url: string }[]
  timestamp: Date
}

const suggestedPrompts = [
  { text: "What services do you offer?", category: "Services" },
  { text: "How can you help with market research?", category: "Services" },
  { text: "What industries do you serve?", category: "Industries" },
  { text: "Tell me about your data collection methods", category: "Methodology" },
  { text: "What certifications do you have?", category: "Credentials" },
  { text: "How do you ensure data quality?", category: "Methodology" },
  { text: "What is your experience in social research?", category: "Services" },
  { text: "Can you help with brand tracking studies?", category: "Services" },
]

export default function AIInsightsPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to Avance Insights AI! I'm your intelligent research assistant, powered by advanced AI to help you explore our services, methodologies, and expertise.\n\nI can help you with:\n• Understanding our research services\n• Learning about our methodologies\n• Exploring case studies and insights\n• Finding the right solution for your needs\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input
    if (!text.trim() || isLoading || fetchingRef.current) return

    fetchingRef.current = true
    setIsLoading(true)

    const assistantMessageId = `${Date.now()}-assistant`
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10),
          stream: true,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
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
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting right now. Please try again or contact us directly at info@avanceinsights.in",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      fetchingRef.current = false
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="pt-20 min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28">
              {/* AI Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-secondary-200/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-secondary-900">AI Assistant</h2>
                    <p className="text-xs text-secondary-500">Real-time Intelligence</p>
                  </div>
                </div>
                <p className="text-sm text-secondary-600 leading-relaxed">
                  Ask me anything about Avance Insights' services, methodologies, 
                  and research expertise.
                </p>
              </div>

              {/* Suggested Prompts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200/60">
                <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  Suggested Questions
                </h3>
                <div className="space-y-2">
                  {suggestedPrompts.slice(0, 6).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt.text)}
                      className="w-full text-left p-3 rounded-lg bg-secondary-50 hover:bg-primary-50 text-sm text-secondary-700 hover:text-primary-700 transition-colors border border-transparent hover:border-primary-100"
                    >
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={clearChat}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-secondary-200 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Chat
                </button>
              </div>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-[calc(100vh-180px)] border border-secondary-200/60">
              {/* Chat Header */}
              <div className="px-8 py-6 border-b border-secondary-100 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-display font-bold text-secondary-900 leading-none">
                        Research Assistant
                      </h1>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-secondary-500">Intelligent & Real-time</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Global Expertise</p>
                      <p className="text-sm font-semibold text-secondary-700">Pan-India Support</p>
                    </div>
                    <div className="h-10 w-px bg-secondary-100" />
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Status</p>
                      <p className="text-sm font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-secondary-50/30 scroll-smooth">
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className={cn(
                      'flex gap-5',
                      message.role === 'user' && 'flex-row-reverse'
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border',
                        message.role === 'assistant'
                          ? 'bg-white border-primary-100 text-primary-600'
                          : 'bg-primary-600 border-primary-500 text-white'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <Bot className="w-6 h-6" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[75%] rounded-[24px] px-6 py-5 shadow-sm',
                        message.role === 'assistant'
                          ? 'bg-white border border-secondary-200/60 text-secondary-800 rounded-tl-none'
                          : 'bg-primary-600 text-white rounded-tr-none'
                      )}
                    >
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0">
                        <p className="whitespace-pre-wrap">
                          {message.content}
                          {message.role === 'assistant' && idx === messages.length - 1 && isLoading && message.content === "" && (
                            <span className="inline-flex w-1 h-4 bg-primary-400 ml-1 animate-pulse" />
                          )}
                        </p>
                      </div>
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-secondary-100">
                          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-3">
                            Verified Sources & Insights
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, i) => (
                              <a
                                key={i}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 hover:bg-primary-50 border border-secondary-100 hover:border-primary-200 rounded-xl text-xs font-medium text-primary-700 transition-all duration-200 group"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-primary-400 group-hover:text-primary-600" />
                                {source.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={cn(
                        'flex items-center gap-2 mt-4',
                        message.role === 'assistant' ? 'text-secondary-400' : 'text-white/60'
                      )}>
                        <span className="text-[10px] font-medium uppercase tracking-tighter">
                          {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div className="bg-white border border-secondary-200/60 rounded-[24px] rounded-tl-none px-7 py-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-sm font-medium text-secondary-500">Analyzing research data...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-8 border-t border-secondary-100 bg-white">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-[28px] opacity-0 group-focus-within:opacity-20 transition-opacity blur-lg" />
                  <div className="relative flex items-center gap-4 bg-secondary-50 p-2.5 rounded-[24px] border border-secondary-200 group-focus-within:border-primary-400 group-focus-within:bg-white transition-all shadow-inner">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about our research services, methodologies, or global reach..."
                      className="flex-1 px-6 py-4 bg-transparent text-base focus:outline-none placeholder:text-secondary-400 text-secondary-900"
                      disabled={isLoading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        'h-14 px-8 rounded-[18px] flex items-center gap-3 transition-all font-bold shadow-lg shadow-primary-500/10',
                        input.trim() && !isLoading
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-primary-500/25'
                          : 'bg-secondary-200 text-secondary-400'
                      )}
                    >
                      <span>Ask Avance</span>
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-secondary-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Groq Llama 3.1</span>
                    <span className="w-1 h-1 bg-secondary-300 rounded-full" />
                    <span>Real-time Response</span>
                  </div>
                  <p className="text-xs text-secondary-400">
                    Avance AI may provide automated research assistance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
