'use client'

import { useState } from 'react'

interface FeedbackScores {
  content: number
  argumentation: number
  structure: number
  language: number
  originality: number
}

interface FeedbackResult {
  scores: FeedbackScores
  feedback: {
    content: string[]
    argumentation: string[]
    structure: string[]
    language: string[]
    originality: string[]
  }
  totalScore: number
  overallFeedback: string
}

export default function FileUploadWithFeedback() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)

  const analyzeFeedback = (content: string): FeedbackResult => {
    const words = content.split(/\s+/).filter(word => word.length > 0)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    // Content Analysis
    const contentScore = Math.min(8, Math.max(1, Math.floor((content.length / 500) * 8)))
    const contentFeedback = []
    if (words.length < 100) {
      contentFeedback.push("• De tekst is aan de korte kant. Probeer meer diepgang toe te voegen.")
    }
    if (sentences.length < 10) {
      contentFeedback.push("• Voeg meer uitleg en voorbeelden toe om je punten te verduidelijken.")
    }
    contentFeedback.push(`• Je tekst bevat ${words.length} woorden en ${sentences.length} zinnen.`)
    
    // Argumentation Analysis
    const argumentMarkers = ['omdat', 'dus', 'daarom', 'echter', 'bovendien', 'ten eerste', 'concluderend']
    const argumentCount = argumentMarkers.reduce((count, marker) => 
      count + content.toLowerCase().split(marker).length - 1, 0)
    const argumentationScore = Math.min(8, Math.max(1, Math.floor((argumentCount / 5) * 8)))
    const argumentationFeedback = []
    if (argumentCount < 3) {
      argumentationFeedback.push("• Gebruik meer verbindingswoorden om je argumenten te onderbouwen.")
    }
    argumentationFeedback.push(`• Je gebruikt ${argumentCount} argumentatieve verbindingen.`)
    
    // Structure Analysis
    const structureScore = Math.min(8, Math.max(1, Math.floor((paragraphs.length / 4) * 8)))
    const structureFeedback = []
    if (paragraphs.length < 3) {
      structureFeedback.push("• Je tekst heeft weinig paragrafen. Verdeel je tekst in meer logische delen.")
    }
    structureFeedback.push(`• Je tekst bevat ${paragraphs.length} paragrafen.`)
    
    // Language Analysis
    const longWords = words.filter(w => w.length > 10).length
    const complexityRatio = longWords / words.length
    const languageScore = Math.min(8, Math.max(1, Math.floor((1 - complexityRatio) * 8)))
    const languageFeedback = []
    if (complexityRatio > 0.2) {
      languageFeedback.push("• Je gebruikt veel complexe woorden. Overweeg eenvoudigere alternatieven.")
    }
    languageFeedback.push(`• ${Math.round(complexityRatio * 100)}% van je woorden zijn complex (>10 letters).`)
    
    // Originality Analysis
    const commonPhrases = ['in conclusie', 'met andere woorden', 'zoals eerder genoemd']
    const commonPhraseCount = commonPhrases.reduce((count, phrase) => 
      count + content.toLowerCase().split(phrase).length - 1, 0)
    const originalityScore = Math.min(8, Math.max(1, 8 - commonPhraseCount))
    const originalityFeedback = []
    if (commonPhraseCount > 3) {
      originalityFeedback.push("• Probeer clichés te vermijden en gebruik meer originele formuleringen.")
    }
    originalityFeedback.push("• Zoek naar unieke invalshoeken om je argumenten te presenteren.")

    const scores = {
      content: contentScore,
      argumentation: argumentationScore,
      structure: structureScore,
      language: languageScore,
      originality: originalityScore
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5

    // Generate overall feedback based on total score
    let overallFeedback = ""
    if (totalScore <= 2) {
      overallFeedback = "Je document heeft nog veel ruimte voor verbetering. Focus vooral op het uitbreiden van je argumenten en het verbeteren van de structuur."
    } else if (totalScore <= 4) {
      overallFeedback = "Je document toont basis begrip, maar kan baat hebben bij meer diepgang en betere onderbouwing van je argumenten."
    } else if (totalScore <= 6) {
      overallFeedback = "Je document is over het algemeen goed geschreven. Met wat extra aandacht voor detail kan het nog sterker worden."
    } else {
      overallFeedback = "Uitstekend werk! Je document toont een hoog niveau van begrip en is zeer goed uitgewerkt."
    }

    return {
      scores,
      feedback: {
        content: contentFeedback,
        argumentation: argumentationFeedback,
        structure: structureFeedback,
        language: languageFeedback,
        originality: originalityFeedback
      },
      totalScore,
      overallFeedback
    }
  }

  const handleFileSelect = async (file: File) => {
    const isDocx = file.name.endsWith('.docx')
    const isPdf = file.name.endsWith('.pdf')
    
    if (!isDocx && !isPdf) {
      alert('Alleen .docx en .pdf bestanden zijn toegestaan!')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)
    setFeedback(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload-docx', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      const feedbackResult = analyzeFeedback(data.content)
      setFeedback(feedbackResult)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Er is een fout opgetreden bij het uploaden van het bestand.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const getScoreColor = (score: number): string => {
    if (score <= 2) return 'text-red-600'
    if (score <= 4) return 'text-orange-600'
    if (score <= 6) return 'text-green-600'
    return 'text-emerald-600'
  }

  const getScoreLabel = (score: number): string => {
    if (score <= 2) return 'Onvoldoende'
    if (score <= 4) return 'Voldoende'
    if (score <= 6) return 'Goed'
    return 'Uitstekend'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              Sleep je document hier naartoe
            </p>
            <p className="text-sm text-gray-500 mt-1">
              of klik om een bestand te selecteren
            </p>
          </div>
          
          <input
            type="file"
            accept=".docx,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
            className="hidden"
            id="file-input"
          />
          
          <label
            htmlFor="file-input"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Bestand Selecteren
          </label>
          
          <p className="text-xs text-gray-400">
            Ondersteunde formaten: .docx, .pdf (max 10MB)
          </p>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Document wordt geanalyseerd...</span>
          </div>
        </div>
      )}

      {/* Feedback Display */}
      {feedback && (
        <div className="bg-white border border-gray-200 rounded-lg divide-y">
          {/* Overall Score and Feedback */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Totale Beoordeling
              </h3>
              <div className="text-3xl font-bold text-purple-600">
                {feedback.totalScore.toFixed(1)} / 8.0
              </div>
            </div>
            <p className="text-gray-600 bg-purple-50 p-4 rounded-lg">
              {feedback.overallFeedback}
            </p>
          </div>

          {/* Detailed Scores */}
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Gedetailleerde Feedback
            </h3>
            
            {Object.entries(feedback.scores).map(([category, score]) => (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium text-gray-700 capitalize">
                      {category}
                    </span>
                    <span className={`ml-2 text-sm ${getScoreColor(score)}`}>
                      ({getScoreLabel(score)})
                    </span>
                  </div>
                  <span className={`font-semibold ${getScoreColor(score)}`}>
                    {score} / 8
                  </span>
                </div>
                <div className="mt-3 space-y-1">
                  {feedback.feedback[category as keyof typeof feedback.feedback].map((point, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}