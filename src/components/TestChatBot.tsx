'use client'

import { useState, useRef } from 'react'
import FileUpload from './FileUpload'
import VoiceInput from './VoiceInput'

export default function TestChatBot() {
  const [userTextInput, setUserTextInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedContent, setUploadedContent] = useState('')

  const ANALYSIS_PROMPT = "\n\nGeef een uitgebreide analyse van deze tekst met de volgende aspecten:\n1. Hoofdthema's en kernboodschap\n2. Toon en stijl\n3. Structuur en opbouw\n4. Sterke punten\n5. Verbeterpunten\n6. Algemene beoordeling"
  const MAX_MESSAGE_LENGTH = 4000

  const handleVoiceInput = (transcript: string) => {
    setUserTextInput(prev => prev + ' ' + transcript)
  }

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      alert('Alleen .docx en .pdf bestanden zijn toegestaan!')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload-docx', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      const fileInfo = `📎 ${data.filename} (${data.fileType})\n`
      setUploadedContent(fileInfo + data.content)
    } catch (error) {
      console.error('File upload error:', error)
      alert('Fout bij uploaden: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    }
  }

  const constructMessage = () => {
    let baseMessage = userTextInput.trim()
    
    if (uploadedContent) {
      baseMessage = baseMessage ? `${baseMessage}\n\nAnalyseer de volgende tekst:\n\n${uploadedContent}` : uploadedContent
    }

    const fullMessage = baseMessage + ANALYSIS_PROMPT
    
    if (fullMessage.length > MAX_MESSAGE_LENGTH) {
      const availableSpace = MAX_MESSAGE_LENGTH - (ANALYSIS_PROMPT.length + baseMessage.length - uploadedContent.length)
      const truncatedContent = uploadedContent.slice(0, availableSpace)
      setResponse('Let op: De geüploade tekst was te lang en is ingekort voor analyse.')
      return baseMessage.replace(uploadedContent, truncatedContent) + ANALYSIS_PROMPT
    }

    return fullMessage
  }

  const sendMessage = async () => {
    if (!userTextInput.trim() && !uploadedContent) return

    setIsLoading(true)
    try {
      const messageToSend = constructMessage()
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
        <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-2">
          <span className="text-white text-sm">💬</span>
        </span>
        Tekst Analyse Chatbot
      </h3>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <textarea
            value={userTextInput}
            onChange={(e) => setUserTextInput(e.target.value)}
            placeholder="Voer een tekst in voor analyse, upload een document, of gebruik de microfoon..."
            className="w-full p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            disabled={isLoading}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <FileUpload onFileUpload={handleFileUpload} />
              <VoiceInput onTranscript={handleVoiceInput} isDisabled={isLoading} />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={isLoading || (!userTextInput.trim() && !uploadedContent)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Analyseren...' : 'Analyseer Tekst'}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <span className="text-purple-700">Bezig met analyseren...</span>
            </div>
          </div>
        )}

        {response && !isLoading && (
          <div className="bg-white border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">Tekstanalyse:</h4>
            <div className="prose prose-purple max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{response}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}