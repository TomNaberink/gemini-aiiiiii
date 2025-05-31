'use client'

import { useState } from 'react'
import VoiceInput from '@/components/VoiceInput'
import FileUpload from '@/components/FileUpload'

type Character = {
  id: string
  name: string
  emoji: string
  description: string
  greeting: string
  avatar: string
}

const characters: Character[] = [
  {
    id: 'justin',
    name: 'Justin Bieber',
    emoji: '🎤',
    description: 'Pop superstar',
    greeting: "Hey! I'm Justin Bieber! What's up? Let's chat! 🎵",
    avatar: 'https://images.pexels.com/photos/1771383/pexels-photo-1771383.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'taylor',
    name: 'Taylor Swift',
    emoji: '🎸',
    description: 'Singer-songwriter',
    greeting: "Hi! Taylor Swift here! Ready to shake off some conversation? 💫",
    avatar: 'https://images.pexels.com/photos/1539936/pexels-photo-1539936.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'elon',
    name: 'Elon Musk',
    emoji: '🚀',
    description: 'Tech entrepreneur',
    greeting: "Hello! This is Elon. Let's talk about the future of technology! 🌟",
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'emma',
    name: 'Emma Watson',
    emoji: '📚',
    description: 'Actress & Activist',
    greeting: "Hi there! Emma Watson speaking. Excited to discuss education, acting, and making a difference! ✨",
    avatar: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    emoji: '⚽',
    description: 'Football legend',
    greeting: "Olá! CR7 here! Let's talk about football, fitness, and achieving your goals! 🏆",
    avatar: 'https://images.pexels.com/photos/159516/soccer-football-player-match-159516.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
]

export default function Home() {
  const [currentCharacter, setCurrentCharacter] = useState<Character>(characters[0])
  const [showCharacterSelect, setShowCharacterSelect] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'teacher', content: string }>>([
    { 
      role: 'assistant', 
      content: characters[0].greeting
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal')

  const handleCharacterChange = (character: Character) => {
    setCurrentCharacter(character)
    setMessages([{ role: 'assistant', content: character.greeting }])
    setShowCharacterSelect(false)
  }

  const handleSend = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage
    setInputMessage('')
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `You are ${currentCharacter.name}. Respond to this message in your style: ${userMessage}`,
          character: currentCharacter.id,
          difficulty
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')
      
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble right now. Can we try again?" 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTeacherFeedback = async () => {
    setIsLoading(true)
    
    try {
      const userMessages = messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n')

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `You are an English language teacher. Review the following English conversation from a student. Provide constructive feedback on their English language usage, including grammar, vocabulary, and suggestions for improvement. Here are their messages:\n\n${userMessages}`,
          isTeacher: true
        }),
      })

      if (!res.ok) throw new Error('Failed to get teacher feedback')
      
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'teacher', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'teacher', 
        content: "Sorry, I couldn't provide feedback at this moment. Please try again later." 
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
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowCharacterSelect(!showCharacterSelect)}
              className="relative group"
            >
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors border-2 border-purple-300 group-hover:border-purple-400 overflow-hidden">
                <img 
                  src={currentCharacter.avatar} 
                  alt={currentCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                ↓
              </div>
              {showCharacterSelect && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-purple-100 py-2 z-10">
                  <div className="px-4 py-2 text-sm text-purple-600 border-b border-purple-100">
                    Choose your chat partner:
                  </div>
                  {characters.map(character => (
                    <div
                      key={character.id}
                      onClick={() => handleCharacterChange(character)}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={character.avatar} 
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{character.name}</div>
                        <div className="text-sm text-gray-500">{character.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
            <div>
              <h1 className="text-xl font-bold text-purple-900">Chat with {currentCharacter.name}</h1>
              <p className="text-sm text-purple-600">Practice your English in a fun way! {currentCharacter.emoji}</p>
            </div>
          </div>
          <button
            onClick={handleTeacherFeedback}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>👩‍🏫</span>
            <span>Teacher Feedback</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.role === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
                    You
                  </div>
                ) : message.role === 'teacher' ? (
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                    👩‍🏫
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={currentCharacter.avatar} 
                      alt={currentCharacter.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : message.role === 'teacher'
                    ? 'bg-green-50 border border-green-200 text-gray-800 rounded-bl-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                {message.role === 'teacher' && (
                  <div className="font-semibold mb-1">Teacher Feedback:</div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={currentCharacter.avatar} 
                  alt={currentCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-500">Typing...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Upload Area */}
      {showUpload && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Difficulty Controls */}
          <div className="flex justify-center mb-4 space-x-2">
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                difficulty === 'easy'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🟢 Easier
            </button>
            <button
              onClick={() => setDifficulty('normal')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                difficulty === 'normal'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🟡 Normal
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                difficulty === 'hard'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔴 Harder
            </button>
          </div>

          <div className="flex items-end space-x-4">
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
                placeholder={`Message ${currentCharacter.name}...`}
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
    </div>
  )
}