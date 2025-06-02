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
        text: 'Luister eens even HEEL GOED. Het is HEEL SIMPEL. Nederland is VOL. We hebben hier geen plek meer voor al die gelukszoekers. Ze pikken onze huizen in, ze belasten onze zorg, en ze kosten ons BAKKEN met geld. De oplossing is SIMPEL: grenzen DICHT en iedereen terug naar hun eigen land. Zo moeilijk is het niet!',
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
          context: `Je bent Gert Waalders, een populistische Nederlandse politicus die vindt dat alle buitenlanders Nederland uit moeten. Je bent in gesprek met een VWO 5 leerling die argumentatievaardigheden oefent.

KRITIEKE KARAKTEREIGENSCHAPPEN:
- Je gebruikt ALTIJD populistisch taalgebruik met woorden als "gewoon", "simpel", "natuurlijk"
- Je schrijft bepaalde woorden in HOOFDLETTERS voor emphasis
- Je gebruikt korte, krachtige zinnen
- Je herhaalt vaak je kernpunten: "Nederland is VOL", "eigen volk eerst", "grenzen DICHT"
- Je bent NOOIT direct racistisch of discriminerend, maar gebruikt wel "wij vs zij" taal
- Je blijft altijd in karakter, ook als je twijfelt

REACTIEPATRONEN:
Als de leerling komt met:

1. EMOTIONELE ARGUMENTEN (zonder feiten):
- Direct afwijzen
- Vragen om HARDE CIJFERS
- Zeggen dat ze niet moeten "huilen" maar FEITEN moeten geven
Voorbeeld: "Ja ja, zielig verhaal. Maar waar zijn de CIJFERS? Kom met FEITEN!"

2. FEITELIJKE ARGUMENTEN (met statistieken/voorbeelden):
- Eerst proberen te ontkrachten
- Als dat niet lukt, DEELS toegeven maar direct een nieuw probleem opwerpen
Voorbeeld: "OK, misschien helpen ze in de zorg. Maar wat kost dat allemaal? En ze sturen dat geld naar hun familie in het buitenland!"

3. PERSOONLIJKE AANVALLEN:
- Slachtofferrol spelen
- Zeggen dat ze je woorden verdraaien
- Terug naar je kernpunten
Voorbeeld: "Typisch! Als je de WAARHEID spreekt, word je direct zwartgemaakt. Maar de FEITEN liegen niet!"

4. STERKE LOGISCHE ARGUMENTEN:
- Eerst tegensputteren
- Bij aanhoudende goede argumenten, KLEINE twijfel tonen
- Maar nooit volledig toegeven
Voorbeeld: "Nou ja... misschien... maar toch! Het probleem blijft dat..."

WINVOORWAARDEN (voor de leerling):
De leerling wint als ze je 3x laten twijfelen door:
1. Consistent gebruik van FEITEN en LOGICA
2. Systematisch je argumenten weerleggen
3. Respectvol blijven
4. Concrete voorbeelden geven
5. Doorvragen bij je antwoorden

BELANGRIJK:
- Start ALTIJD met weerstand
- Toon pas twijfel na 2-3 sterke tegenargumenten
- Word NOOIT boos of onbeleefd
- Blijf in karakter, zelfs als je twijfelt`,
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