'use client'

import { useState, useRef, useEffect } from 'react'
import VoiceInput from './VoiceInput'

type Message = {
  id: string
  text: string
  sender: 'user' | 'gert'
  timestamp: Date
}

export default function GertWaaldersChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Initial messages from Gert
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Beste leerling, welkom bij deze simulatie. Je gaat in debat met Gert Waalders over immigratie. Gebruik sterke argumenten en blijf respectvol. Succes!',
        sender: 'gert',
        timestamp: new Date()
      },
      {
        id: '2',
        text: 'Kijk nou eens naar de FEITEN! Nederland is VOL. We kunnen al die mensen hier niet hebben. De huizen zijn voor ONZE mensen. De zorg is voor ONZE mensen. Alle buitenlanders moeten gewoon terug naar hun eigen land!',
        sender: 'gert',
        timestamp: new Date()
      }
    ]
    setMessages(initialMessages)
  }, [])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputMessage,
          context: `Je bent Gert Waalders, een Nederlandse politicus die vindt dat alle buitenlanders Nederland moeten verlaten. Je bent in debat met een VWO 5 leerling die argumentatievaardigheden oefent.

Gedragsregels voor jouw rol:
1. Spreek in populistisch Nederlands, gebruik woorden als "gewoon", "simpel", "natuurlijk"
2. Blijf bij je standpunt maar pas je argumentatie aan op basis van wat de leerling zegt
3. Als de leerling goede argumenten gebruikt (met feiten, voorbeelden, logica):
   - Toon lichte twijfel of erken deels hun punt
   - Maar kom dan met een nieuw tegenargument
4. Als de leerling zwakke argumenten gebruikt (emotioneel, zonder onderbouwing):
   - Wijs dit direct af
   - Vraag om bewijs of voorbeelden
5. Let op argumentatiefouten van de leerling en benoem deze
6. Gebruik GEEN scheldwoorden of echt kwetsende taal
7. Blijf in je rol maar houd het leerzaam

De leerling "wint" als ze:
- Consistent logische argumenten gebruiken
- Hun claims onderbouwen met feiten
- Respectvol blijven
- Je argumenten systematisch weerleggen
- Je tot drie keer toe laten twijfelen

Pas je antwoorden aan op basis van hoe goed ze argumenteren. Hoe beter hun argumentatie, hoe meer je moet laten zien dat je aan het twijfelen bent.`,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        }),
      })

      const data = await response.json()
      
      const gertResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'gert',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, gertResponse])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = (transcript: string) => {
    setInputMessage(prev => prev + ' ' + transcript)
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
            GW
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Gert Waalders</h1>
            <p className="text-purple-200 text-sm">Argumentatie Training VWO 5</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-[500px] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Type je argument..."
              className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
          <div className="flex space-x-2">
            <VoiceInput onTranscript={handleVoiceInput} isDisabled={isLoading} />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Verstuur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}