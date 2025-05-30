'use client'

import { useState } from 'react'

export default function TestChatBot() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'bot', content: string }>>([])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = `Je bent een ervaren economie docent. Je geeft duidelijke, praktische uitleg over economische concepten en gebruikt graag voorbeelden uit het dagelijks leven. Beantwoord de volgende vraag: ${message}`

    setIsLoading(true)
    setChatHistory(prev => [...prev, { role: 'user', content: message }])
    setMessage('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!res.ok) {
        throw new Error('Er is een fout opgetreden')
      }

      const data = await res.json()
      setChatHistory(prev => [...prev, { role: 'bot', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setChatHistory(prev => [...prev, { role: 'bot', content: 'Er is helaas een fout opgetreden. Probeer het later nog eens.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Chat History */}
      <div className="h-[500px] overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Welkom! Stel je vraag over economie.</p>
            <p className="text-sm mt-2">Bijvoorbeeld:</p>
            <ul className="text-sm mt-1 space-y-1">
              <li>"Wat is inflatie?"</li>
              <li>"Kun je vraag en aanbod uitleggen?"</li>
              <li>"Hoe werkt de aandelenbeurs?"</li>
            </ul>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Stel je vraag over economie..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Verstuur
          </button>
        </div>
      </div>
    </div>
  )
}