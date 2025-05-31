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
  metrics: {
    wordCount: number
    sentenceCount: number
    paragraphCount: number
    avgSentenceLength: number
    avgParagraphLength: number
    complexWordPercentage: number
    argumentMarkerCount: number
    transitionWordCount: number
  }
}

export default function FileUploadWithFeedback() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)

  const analyzeFeedback = (content: string): FeedbackResult => {
    // Basic text analysis
    const words = content.split(/\s+/).filter(word => word.length > 0)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgSentenceLength = words.length / sentences.length
    const avgParagraphLength = words.length / paragraphs.length

    // Content Analysis
    const contentFeedback = []
    let contentScore = 0

    // Word count analysis
    if (words.length < 300) {
      contentFeedback.push("• De tekst is te kort voor een diepgaande analyse. Voeg meer inhoud toe.")
      contentScore += 1
    } else if (words.length < 500) {
      contentFeedback.push("• De lengte is voldoende maar kan baat hebben bij meer uitwerking.")
      contentScore += 2
    } else if (words.length < 800) {
      contentFeedback.push("• Goede tekstlengte met ruimte voor diepgang.")
      contentScore += 3
    } else {
      contentFeedback.push("• Uitstekende tekstlengte die ruimte biedt voor grondige analyse.")
      contentScore += 4
    }

    // Sentence complexity
    if (avgSentenceLength < 10) {
      contentFeedback.push("• Zinnen zijn aan de korte kant. Overweeg meer detail per zin.")
    } else if (avgSentenceLength > 25) {
      contentFeedback.push("• Sommige zinnen zijn erg lang. Overweeg ze op te splitsen voor betere leesbaarheid.")
    } else {
      contentFeedback.push("• Goede gemiddelde zinslengte voor academisch schrijven.")
      contentScore += 2
    }

    // Topic coverage
    const keywordDensity = new Set(words.map(w => w.toLowerCase())).size / words.length
    if (keywordDensity > 0.6) {
      contentFeedback.push("• Gevarieerd woordgebruik duidt op goede dekking van het onderwerp.")
      contentScore += 2
    }

    // Argumentation Analysis
    const argumentFeedback = []
    let argumentationScore = 0

    // Transition words analysis
    const argumentMarkers = {
      reasoning: ['omdat', 'dus', 'daarom', 'aangezien', 'vandaar'],
      contrast: ['echter', 'maar', 'daarentegen', 'hoewel', 'ondanks'],
      addition: ['bovendien', 'daarnaast', 'tevens', 'ook', 'verder'],
      example: ['bijvoorbeeld', 'zoals', 'ter illustratie', 'denk aan'],
      conclusion: ['concluderend', 'samenvattend', 'kortom', 'tot slot']
    }

    let totalMarkers = 0
    let markerTypes = 0

    for (const [type, markers] of Object.entries(argumentMarkers)) {
      const count = markers.reduce((sum, marker) => 
        sum + content.toLowerCase().split(marker).length - 1, 0)
      totalMarkers += count
      if (count > 0) markerTypes++
      
      if (count === 0) {
        argumentFeedback.push(`• Gebruik meer ${type} verbindingswoorden (${markers.join(', ')}).`)
      }
    }

    // Score based on marker variety and frequency
    argumentationScore = Math.min(8, Math.floor((markerTypes * 1.2 + totalMarkers * 0.4)))
    
    if (totalMarkers < 5) {
      argumentFeedback.push("• Gebruik meer verbindingswoorden om je argumenten te versterken.")
    } else if (totalMarkers > 15) {
      argumentFeedback.push("• Goed gebruik van verbindingswoorden. Let op dat het niet geforceerd wordt.")
    }

    // Structure Analysis
    const structureFeedback = []
    let structureScore = 0

    // Paragraph analysis
    if (paragraphs.length < 3) {
      structureFeedback.push("• Te weinig paragrafen. Deel je tekst op in meer logische secties.")
      structureScore += 1
    } else if (paragraphs.length < 5) {
      structureFeedback.push("• Basis structuur aanwezig. Overweeg meer onderverdeling voor betere flow.")
      structureScore += 2
    } else {
      structureFeedback.push("• Goede verdeling in paragrafen.")
      structureScore += 3
    }

    // Paragraph length consistency
    const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length)
    const paragraphLengthVariance = Math.max(...paragraphLengths) / Math.min(...paragraphLengths)
    
    if (paragraphLengthVariance > 4) {
      structureFeedback.push("• Grote variatie in paragraaflengte. Streef naar meer consistentie.")
    } else {
      structureFeedback.push("• Goede consistentie in paragraaflengte.")
      structureScore += 2
    }

    // Introduction and conclusion check
    const hasIntro = paragraphs[0].length > 50
    const hasConclusion = paragraphs[paragraphs.length - 1].length > 50
    
    if (hasIntro && hasConclusion) {
      structureFeedback.push("• Duidelijke inleiding en conclusie aanwezig.")
      structureScore += 3
    } else {
      structureFeedback.push("• Versterk je inleiding en/of conclusie.")
    }

    // Language Analysis
    const languageFeedback = []
    let languageScore = 0

    // Complex words analysis
    const complexWords = words.filter(w => w.length > 10)
    const complexityRatio = complexWords.length / words.length
    
    if (complexityRatio > 0.2) {
      languageFeedback.push("• Veel complexe woorden. Overweeg vereenvoudiging waar mogelijk.")
      languageScore += 2
    } else if (complexityRatio < 0.05) {
      languageFeedback.push("• Woordgebruik is mogelijk te simpel voor academisch werk.")
      languageScore += 1
    } else {
      languageFeedback.push("• Goed evenwicht in woordcomplexiteit.")
      languageScore += 3
    }

    // Sentence variety
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length)
    const sentenceLengthVariance = Math.max(...sentenceLengths) / Math.min(...sentenceLengths)
    
    if (sentenceLengthVariance > 3) {
      languageFeedback.push("• Goede variatie in zinslengte.")
      languageScore += 3
    } else {
      languageFeedback.push("• Meer variatie in zinslengte kan de tekst levendiger maken.")
    }

    // Passive voice check (basic)
    const passiveIndicators = ['wordt', 'worden', 'werd', 'werden'].map(word =>
      content.toLowerCase().split(word).length - 1
    ).reduce((a, b) => a + b, 0)
    
    if (passiveIndicators > sentences.length * 0.3) {
      languageFeedback.push("• Veel gebruik van passieve vorm. Overweeg actiever taalgebruik.")
    } else {
      languageFeedback.push("• Goed evenwicht tussen actief en passief taalgebruik.")
      languageScore += 2
    }

    // Originality Analysis
    const originalityFeedback = []
    let originalityScore = 0

    // Common phrases check
    const commonPhrases = [
      'in conclusie',
      'met andere woorden',
      'zoals eerder genoemd',
      'al met al',
      'het is duidelijk dat'
    ]
    
    const commonPhraseCount = commonPhrases.reduce((count, phrase) => 
      count + content.toLowerCase().split(phrase).length - 1, 0)
    
    if (commonPhraseCount > 5) {
      originalityFeedback.push("• Vermijd clichématige uitdrukkingen.")
      originalityScore += 1
    } else if (commonPhraseCount > 2) {
      originalityFeedback.push("• Beperkt gebruik van standaardfrases.")
      originalityScore += 2
    } else {
      originalityFeedback.push("• Goed gebruik van originele formuleringen.")
      originalityScore += 3
    }

    // Unique vocabulary analysis
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size
    const vocabularyRatio = uniqueWords / words.length
    
    if (vocabularyRatio > 0.6) {
      originalityFeedback.push("• Uitstekende variatie in woordkeuze.")
      originalityScore += 3
    } else if (vocabularyRatio > 0.4) {
      originalityFeedback.push("• Goede variatie in woordgebruik.")
      originalityScore += 2
    } else {
      originalityFeedback.push("• Meer variatie in woordkeuze kan de tekst versterken.")
    }

    // Personal voice check
    const personalPronouns = ['ik', 'mijn', 'wij', 'onze'].map(word =>
      content.toLowerCase().split(word).length - 1
    ).reduce((a, b) => a + b, 0)
    
    if (personalPronouns > 0) {
      originalityFeedback.push("• Persoonlijke stem aanwezig in de tekst.")
      originalityScore += 2
    }

    // Calculate final scores
    const scores = {
      content: Math.min(8, contentScore),
      argumentation: Math.min(8, argumentationScore),
      structure: Math.min(8, structureScore),
      language: Math.min(8, languageScore),
      originality: Math.min(8, originalityScore)
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5

    // Generate overall feedback
    let overallFeedback = ""
    if (totalScore <= 2) {
      overallFeedback = "Je document heeft nog veel ruimte voor verbetering. Focus op het uitbreiden van je argumenten, het verbeteren van de structuur, en het toevoegen van meer diepgang in je analyse."
    } else if (totalScore <= 4) {
      overallFeedback = "Je document toont basiskennis maar kan baat hebben bij meer diepgang, sterkere argumentatie en een duidelijkere structuur. Werk aan de samenhang tussen paragrafen en onderbouw je stellingen beter."
    } else if (totalScore <= 6) {
      overallFeedback = "Je document is over het algemeen goed geschreven met duidelijke argumenten en een logische structuur. Voor verdere verbetering kun je focussen op meer gevarieerd taalgebruik en het versterken van je eigen stem in de tekst."
    } else {
      overallFeedback = "Uitstekend werk! Je document toont een hoog niveau van begrip, is zeer goed gestructureerd en bevat overtuigende argumentatie. De tekst is origineel en boeiend geschreven met een goede balans tussen academisch en toegankelijk taalgebruik."
    }

    return {
      scores,
      feedback: {
        content: contentFeedback,
        argumentation: argumentFeedback,
        structure: structureFeedback,
        language: languageFeedback,
        originality: originalityFeedback
      },
      totalScore,
      overallFeedback,
      metrics: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        avgSentenceLength,
        avgParagraphLength,
        complexWordPercentage: complexityRatio * 100,
        argumentMarkerCount: totalMarkers,
        transitionWordCount: markerTypes
      }
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

            {/* Document Metrics */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Woorden</div>
                <div className="text-lg font-semibold">{feedback.metrics.wordCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Zinnen</div>
                <div className="text-lg font-semibold">{feedback.metrics.sentenceCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Paragrafen</div>
                <div className="text-lg font-semibold">{feedback.metrics.paragraphCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Gem. Zinslengte</div>
                <div className="text-lg font-semibold">{feedback.metrics.avgSentenceLength.toFixed(1)}</div>
              </div>
            </div>
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