'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  "Am I overtraining?",
  "Why aren't my lifts going up?",
  "What should I eat before leg day?",
  "How do I fix a strength imbalance?",
  "Can you review my recent progress?",
  "How do I break through a plateau?",
]

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="h-4 w-4 text-violet-400" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-violet-500 text-white rounded-tr-sm'
            : 'bg-slate-800 text-slate-100 border border-white/10 rounded-tl-sm'
        )}
      >
        {/* Render line breaks and simple formatting */}
        {message.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-slate-300">
          U
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-4 w-4 text-violet-400" />
      </div>
      <div className="bg-slate-800 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    const userMessage: Message = { role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response')
    } finally {
      setLoading(false)
      // Refocus textarea
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
    textareaRef.current?.focus()
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/10 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            AI Coach
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Knows your profile, goals, and workout history
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-slate-500 hover:text-slate-300 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New chat
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Your AI Coach</h2>
            <p className="text-slate-400 text-sm max-w-sm mb-8">
              Ask me anything about your training, recovery, nutrition timing, or progress. I have full context of your profile and recent workouts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-slate-300 hover:text-white hover:border-violet-500/40 hover:bg-slate-800 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-2 text-sm">
                  {error} — <button onClick={() => sendMessage(messages[messages.length - 1]?.content || '')} className="underline">retry</button>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 pt-4 pb-2 flex-shrink-0">
        {/* Suggested prompts (when chat is active) */}
        {messages.length > 0 && messages.length < 3 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-slate-800 border-white/10 text-white placeholder:text-slate-500 resize-none min-h-[44px] max-h-32 py-2.5"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 128) + 'px'
            }}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="bg-violet-500 hover:bg-violet-600 text-white h-11 w-11 p-0 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">
          Responses are AI-generated. For medical concerns, consult a professional.
        </p>
      </div>
    </div>
  )
}
