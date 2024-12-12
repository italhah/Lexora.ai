'use client'

import { useState } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { type Message } from '../types/chat'

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "What can I help you BRUH?", sender: 'bot' }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
  }

  const handleSendMessage = async (text: string) => {
    addMessage(text, 'user')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, { text, sender: 'user' }] }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response from API')
      }

      const data = await response.json()
      addMessage(data.result, 'bot')
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      addMessage("I'm sorry, but I encountered an error. Please try again later.", 'bot')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) console.error('Error state:', error)

  return (
    <div className="flex flex-col rounded-lg mb-2 overflow-hidden">
      <MessageList messages={messages} />
      {error && <div className="p-4 bg-red-100 text-red-700">{error}</div>}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

