'use client'

import { useState } from 'react'
import VoiceInput from '@/components/VoiceInput'
import FileUpload from '@/components/FileUpload'

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { 
      role: 'assistant', 
      content: "Hey! I'm Justin Bieber! What's up? Let's chat! 🎵" 
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const handleSend = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage
    setInputMessage('')
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `You are Justin Bieber. Respond to this message in your style: ${userMessage}` 
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')
      
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble with my mic right now. Can we try again? 🎤" 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = (transcript: string) => {
    setInputMessage(prev => prev + ' ' + transcript)
  }

  const handleFileUpload = (file: File) => {
    setShowUpload(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-2xl">🎤</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-purple-900">Chat with Justin Bieber</h1>
          <p className="text-sm text-purple-600">I'll be your virtual Justin today! 🎵</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-gray-500">Justin is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* File Upload Area */}
      {showUpload && (
        <div className="p-4 bg-white border-t border-gray-200">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-end space-x-4">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            📎
          </button>
          
          <div className="flex-1 bg-purple-50 rounded-lg border border-purple-100">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Justin..."
              className="w-full p-3 bg-transparent border-0 focus:ring-0 resize-none"
              rows={1}
            />
          </div>

          <div className="flex items-center space-x-2">
            <VoiceInput onTranscript={handleVoiceInput} isDisabled={isLoading} />
            
            <button
              onClick={handleSend}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}