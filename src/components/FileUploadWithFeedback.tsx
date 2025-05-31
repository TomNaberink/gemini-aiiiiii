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
    content: string
    argumentation: string
    structure: string
    language: string
    originality: string
  }
  totalScore: number
}

export default function FileUploadWithFeedback() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)

  const analyzeFeedback = (content: string): FeedbackResult => {
    // This is where we would implement the actual analysis logic
    // For now, we'll use a simplified scoring system
    
    const scores: FeedbackScores = {
      content: Math.min(8, Math.max(1, Math.floor((content.length / 500) * 8))),
      argumentation: Math.min(8, Math.max(1, Math.floor((content.split('omdat').length + content.split('dus').length) * 2))),
      structure: Math.min(8, Math.max(1, Math.floor((content.split('\n\n').length / 3) * 8))),
      language: Math.min(8, Math.max(1, Math.floor((1 - (content.split(' ').filter(w => w.length > 20).length / content.split(' ').length)) * 8))),
      originality: Math.min(8, Math.max(1, Math.floor(Math.random() * 8)))
    }

    const getFeedbackForScore = (score: number, category: string): string => {
      if (score <= 2) return `Je ${category} needs significant improvement.`
      if (score <= 4) return `Je ${category} is voldoende, maar kan beter.`
      if (score <= 6) return `Je ${category} is goed!`
      return `Uitstekend werk met je ${category}!`
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5

    return {
      scores,
      feedback: {
        content: getFeedbackForScore(scores.content, 'inhoud'),
        argumentation: getFeedbackForScore(scores.argumentation, 'argumentatie'),
        structure: getFeedbackForScore(scores.structure, 'structuur'),
        language: getFeedbackForScore(scores.language, 'taalgebruik'),
        originality: getFeedbackForScore(scores.originality, 'originaliteit')
      },
      totalScore
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
          {/* Overall Score */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Totale Score
            </h3>
            <div className="text-3xl font-bold text-purple-600">
              {feedback.totalScore.toFixed(1)} / 8.0
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Gedetailleerde Feedback
            </h3>
            
            {Object.entries(feedback.scores).map(([category, score]) => (
              <div key={category} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700 capitalize">
                    {category}
                  </span>
                  <span className={`font-semibold ${getScoreColor(score)}`}>
                    {score} / 8
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {feedback.feedback[category as keyof typeof feedback.feedback]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}